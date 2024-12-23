import { db } from "@/app/db/index";
import { experience, profiles } from "@/app/db/schema";
import { NextResponse } from 'next/server';
import { eq, or, and } from 'drizzle-orm';

export async function POST(request: Request) {
  try {
    const { title, desc, profileId }: {
      title: string;
      desc: string; 
      profileId: number;
    } = await request.json();

    // Insert new experience and return the ID
    const [insertedExperience] = await db
      .insert(experience)
      .values({
        desc: desc,
        title: title,
        user_id: profileId
      })
      .returning({ id: experience.id });

    return NextResponse.json({ 
      id: insertedExperience.id,
      message: "Experience created successfully" 
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
    // Get the current user's ID from the query params
    const url = new URL(request.url);
    const currentUserId = url.searchParams.get('userId');

    const experiences = await db
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
      .leftJoin(profiles, eq(experience.user_id, profiles.id))
      // Only show hidden experiences to their authors
      .where(
        or(
          eq(experience.is_hidden, false),
          and(
            eq(experience.is_hidden, true),
            eq(experience.user_id, Number(currentUserId) || 0)
          )
        )
      );
    
    return NextResponse.json(experiences);
  } catch (error) {
    console.error('Error fetching experiences:', error);
    return NextResponse.json({ error: 'Failed to fetch experiences' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    // Get the ID from the URL
    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    
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
      id: deletedExperience.id 
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
    const { id, is_hidden }: { id: number; is_hidden: boolean } = await request.json();

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
