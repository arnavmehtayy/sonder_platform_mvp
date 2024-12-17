import { createClient } from '@/app/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { experienceId, index, videoPath } = await request.json();
    const supabase = await createClient();

    const { error } = await supabase
      .from('experience_videos')
      .upsert({
        experience_id: experienceId,
        index: index,
        video_path: videoPath,
      });

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving video reference:', error);
    return NextResponse.json({ error: 'Failed to save video reference' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const experienceId = searchParams.get('experienceId');
    const index = searchParams.get('index');

    if (!experienceId || !index) {
      return NextResponse.json(
        { error: 'Experience ID and index are required' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    const { data, error } = await supabase
      .from('experience_videos')
      .select('video_path')
      .eq('experience_id', experienceId)
      .eq('index', index)
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching video:', error);
    return NextResponse.json({ error: 'Failed to fetch video' }, { status: 500 });
  }
}