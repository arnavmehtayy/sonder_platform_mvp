import { db } from "@/app/db/index";
import { experience } from "@/app/db/schema";
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const experiences = await db
      .select()
      .from(experience);
    
    return NextResponse.json(experiences);
  } catch (error) {
    console.error('Error fetching experiences:', error);
    return NextResponse.json({ error: 'Failed to fetch experiences' }, { status: 500 });
  }
}
