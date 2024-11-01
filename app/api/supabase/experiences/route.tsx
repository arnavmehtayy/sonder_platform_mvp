import { db } from "@/app/db/index";
import { experience, profiles } from "@/app/db/schema";
import { NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';

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


export async function GET() {
  try {
    const experiences = await db
      .select({
        id: experience.id,
        desc: experience.desc,
        title: experience.title,
        userId: profiles.id, // this is the profile ID not the supabase userID
        firstName: profiles.firstName,
        lastName: profiles.lastName,
      })
      .from(experience)
      .leftJoin(profiles, eq(experience.user_id, profiles.id));
    
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
