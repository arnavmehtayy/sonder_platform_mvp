import { useEffect, useState } from 'react';
import { createClient } from '@/app/utils/supabase/client';

interface VideoPlayerProps {
  experienceId: number;
  index: number;
}

export function VideoPlayer({ experienceId, index }: VideoPlayerProps) {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  useEffect(() => {
    const loadVideo = async () => {
      try {
        // Get video reference
        const response = await fetch(
          `/api/supabase/video?experienceId=${experienceId}&index=${index}`
        );
        const data = await response.json();

        if (data?.video_path) {
          const supabase = createClient();
          const { data: { publicUrl } } = supabase.storage
            .from('experience-videos')
            .getPublicUrl(data.video_path);

          setVideoUrl(publicUrl);
        }
      } catch (error) {
        console.error('Error loading video:', error);
      }
    };

    loadVideo();
  }, [experienceId, index]);

  if (!videoUrl) return null;

  return (
    <div className="absolute top-4 right-4 w-96 aspect-video rounded-lg overflow-hidden shadow-lg">
      <video
        src={videoUrl}
        controls
        className="w-full h-full object-cover"
      />
    </div>
  );
}