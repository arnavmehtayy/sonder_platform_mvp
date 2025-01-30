import { db } from "@/app/db/index";
import { experience, profiles } from "@/app/db/schema";
import { NextResponse } from "next/server";
import { eq, or, and, isNull } from "drizzle-orm";

export async function POST(request: Request) {
  try {
    const {
      title,
      desc,
      profileId,
    }: {
      title: string;
      desc: string;
      profileId: number;
    } = await request.json();

    // Check if user is an editor
    const [userProfile] = await db
      .select()
      .from(profiles)
      .where(eq(profiles.id, profileId));

    if (!userProfile) {
      return NextResponse.json(
        { error: "User profile not found" },
        { status: 404 }
      );
    }

    if (!userProfile.is_editor) {
      return NextResponse.json(
        { error: "Only editors can create experiences" },
        { status: 403 }
      );
    }

    // Insert new experience and return the ID
    const [insertedExperience] = await db
      .insert(experience)
      .values({
        desc: desc,
        title: title,
        user_id: profileId,
      })
      .returning({ id: experience.id });

    return NextResponse.json({
      id: insertedExperience.id,
      message: "Experience created successfully",
    });
  } catch (error) {
    console.error("Error creating experience:", error);
    return NextResponse.json(
      { error: "Failed to create experience" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const currentUserId = url.searchParams.get("userId");

    let baseQuery = db
      .select({
        id: experience.id,
        desc: experience.desc,
        title: experience.title,
        userId: profiles.id,
        firstName: profiles.firstName,
        lastName: profiles.lastName,
        is_hidden: experience.is_hidden,
      })
      .from(experience)
      .leftJoin(profiles, eq(experience.user_id, profiles.id));

    if (!currentUserId) {
      // If no user is logged in, only show non-company public experiences
      const experiences = await baseQuery.where(
        and(eq(experience.is_hidden, false), isNull(profiles.company_id))
      );

      return NextResponse.json(experiences);
    }

    // Get the user's profile including company and editor status
    const [userProfile] = await db
      .select()
      .from(profiles)
      .where(eq(profiles.id, parseInt(currentUserId)));

    if (!userProfile) {
      return NextResponse.json(
        { error: "User profile not found" },
        { status: 404 }
      );
    }

    let experiences;
    if (userProfile.company_id) {
      // Company user: Show only their company's content
      experiences = await baseQuery.where(
        and(
          eq(profiles.company_id, userProfile.company_id),
          or(
            eq(experience.is_hidden, false),
            eq(experience.user_id, parseInt(currentUserId))
          )
        )
      );
    } else {
      // Non-company user: Show only public content and their own content
      experiences = await baseQuery.where(
        or(
          // Show public content from non-company users
          and(isNull(profiles.company_id), eq(experience.is_hidden, false)),
          // Show their own content
          eq(experience.user_id, parseInt(currentUserId))
        )
      );
    }

    return NextResponse.json(experiences);
  } catch (error) {
    console.error("Error fetching experiences:", error);
    return NextResponse.json(
      { error: "Failed to fetch experiences" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    // Get the ID from the URL
    const url = new URL(request.url);
    const id = url.searchParams.get("id");

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: "Invalid experience ID" },
        { status: 400 }
      );
    }

    const experienceId = parseInt(id);

    // Delete the experience
    const [deletedExperience] = await db
      .delete(experience)
      .where(eq(experience.id, experienceId))
      .returning();

    if (!deletedExperience) {
      return NextResponse.json(
        { error: "Experience not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Experience deleted successfully",
      id: deletedExperience.id,
    });
  } catch (error) {
    console.error("Error deleting experience:", error);
    return NextResponse.json(
      { error: "Failed to delete experience" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const { id, is_hidden }: { id: number; is_hidden: boolean } =
      await request.json();

    const [updatedExperience] = await db
      .update(experience)
      .set({ is_hidden })
      .where(eq(experience.id, id))
      .returning();

    return NextResponse.json(updatedExperience);
  } catch (error) {
    console.error("Error updating experience:", error);
    return NextResponse.json(
      { error: "Failed to update experience" },
      { status: 500 }
    );
  }
}
