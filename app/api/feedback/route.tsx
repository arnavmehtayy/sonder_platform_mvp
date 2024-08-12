import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

/*
Handle sending information to Vercel's postgres database
Current usage: To store Feedback Information in the Database
*/

export async function POST(request: Request) {
  try {
    const { feedback, email } = await request.json();
    console.log('Received feedback:', feedback, 'Email:', email);

    // Insert the feedback into the database
    await sql`
      INSERT INTO feedbacks (message, email, created_at)
      VALUES (${feedback}, ${email || null}, NOW())
    `;
    console.log('Feedback inserted into database');

    return NextResponse.json({ message: 'Feedback received successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error saving feedback:', error);
    return NextResponse.json({ error: 'Failed to save feedback' }, { status: 500 });
  }
}