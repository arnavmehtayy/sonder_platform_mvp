import { createClient } from '@/app/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const experienceId = formData.get('experienceId') as string;
    const index = formData.get('index') as string;

    if (!file || !experienceId || !index) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // 1. First check if a record exists
    const { data: existingVideo } = await supabase
      .from('experience_videos')
      .select('video_path')
      .eq('experience_id', experienceId)
      .eq('index', index)
      .single();

    // 2. If exists, delete the old video file and database record
    if (existingVideo?.video_path) {
      // Delete old file from storage
      await supabase.storage
        .from('experience-videos')
        .remove([existingVideo.video_path]);
      
      // Delete old database record
      await supabase
        .from('experience_videos')
        .delete()
        .eq('experience_id', experienceId)
        .eq('index', index);
    }

    // 3. Upload new video
    const timestamp = Date.now();
    const fileExtension = file.name.split('.').pop();
    const fileName = `video_${timestamp}.${fileExtension}`;
    const filePath = `${experienceId}/${index}/${fileName}`;

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('experience-videos')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
        contentType: file.type
      });

    if (uploadError) throw uploadError;

    // 4. Insert new database record
    const { error: dbError } = await supabase
      .from('experience_videos')
      .insert({
        experience_id: experienceId,
        index: index,
        video_path: filePath,
      });

    if (dbError) throw dbError;

    return NextResponse.json({ 
      success: true,
      videoPath: filePath
    });

  } catch (error) {
    console.error('Error handling video:', error);
    return NextResponse.json(
      { error: 'Failed to process video' },
      { status: 500 }
    );
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