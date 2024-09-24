import { NextResponse } from 'next/server';
import { saveStateToDatabase, loadStateFromDatabase } from '@/app/api/supabase/databaseFunctions';

export async function POST(request: Request) {
  const { stateName, state } = await request.json();
  try {
    await saveStateToDatabase(stateName, state);
    return NextResponse.json({ message: 'State saved successfully' });
  } catch (error) {
    console.error('Error saving state:', error);
    return NextResponse.json({ error: 'Failed to save state' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const stateName = searchParams.get('stateName');
  
  if (!stateName) {
    return NextResponse.json({ error: 'State name is required' }, { status: 400 });
  }

  try {
    const loadedState = await loadStateFromDatabase(stateName);
    return NextResponse.json(loadedState);
  } catch (error) {
    console.error('Error loading state:', error);
    return NextResponse.json({ error: 'Failed to load state' }, { status: 500 });
  }
}