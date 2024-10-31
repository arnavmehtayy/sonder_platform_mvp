import { db } from "@/app/db/index";
import { experience, profiles } from "@/app/db/schema";
import { NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';

export async function GET() {
  try {
    const experiences = await db
      .select({
        id: experience.id,
        desc: experience.desc,
        title: experience.title,
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
