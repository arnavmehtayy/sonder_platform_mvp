import { useEffect, useRef, useState } from 'react';
import { createClient } from '@/app/utils/supabase/client';
import { useStore, getIsVideoPlayingSelector, setIsVideoPlayingSelector } from '@/app/store';

interface VideoPlayerProps {
  experienceId: number;
  index: number;
}

export function VideoPlayer({ experienceId, index }: VideoPlayerProps) {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const isPlaying = useStore(getIsVideoPlayingSelector);
  const setIsPlaying = useStore(setIsVideoPlayingSelector);

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

  useEffect(() => {
    if (videoRef.current && videoUrl) {
      videoRef.current.play()
        .catch(error => {
          console.log("Autoplay failed:", error);
          setIsPlaying(false);
        });
    }
  }, [videoUrl, setIsPlaying]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        if (videoRef.current.ended) {
          videoRef.current.currentTime = 0;
        }
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleVideoEnd = () => {
    setIsPlaying(false);
  };

  if (!videoUrl) return null;

  return (
    <div className="absolute inset-0 w-full h-full bg-black flex items-center justify-center" onClick={togglePlay}>
      <div className="relative w-full h-full flex items-center justify-center">
        <video
          ref={videoRef}
          src={videoUrl}
          className="max-w-full max-h-full w-auto h-auto object-contain"
          playsInline
          controls={false}
          onEnded={handleVideoEnd}
        />
        {!isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
              <svg 
                className="w-12 h-12 text-white" 
                fill="currentColor" 
                viewBox="0 0 24 24"
              >
                <path d="M8 5v14l11-7z"/>
              </svg>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}