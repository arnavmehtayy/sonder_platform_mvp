import { NextResponse } from 'next/server';
import { db } from '@/app/db';
import { states } from '@/app/db/schema';
import { eq, and } from 'drizzle-orm';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const experienceId = parseInt(searchParams.get('experienceId') || '0');
    const currentIndex = parseInt(searchParams.get('index') || '0');

    // Query the states table to check if there's a state with the next index
    const nextState = await db
      .select()
      .from(states)
      .where(
        and(
          eq(states.experienceId, experienceId),
          eq(states.index, currentIndex + 1)
        )
      )
      .limit(1);


    return NextResponse.json({ 
      hasNext: nextState.length !== 0,
      status: 200 
    });

  } catch (error) {
    console.error('Error checking next experience:', error);
    return NextResponse.json({ 
      hasNext: false,
      error: 'Failed to check next experience',
      status: 500 
    });
  }
}