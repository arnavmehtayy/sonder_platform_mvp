import { useEffect, useRef, useState } from 'react';
import { createClient } from '@/app/utils/supabase/client';
import { useStore, getIsVideoPlayingSelector, setIsVideoPlayingSelector } from '@/app/store';
import { motion, AnimatePresence } from 'framer-motion';

interface VideoPlayerProps {
  experienceId: number;
  index: number;
}

export function VideoPlayer({ experienceId, index }: VideoPlayerProps) {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const isPlaying = useStore(getIsVideoPlayingSelector);
  const setIsPlaying = useStore(setIsVideoPlayingSelector);
  const [videoEnded, setVideoEnded] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const loadVideo = async () => {
      setIsLoading(true);
      try {
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
      } finally {
        setIsLoading(false);
      }
    };

    loadVideo();
  }, [experienceId, index]);

  useEffect(() => {
    if (videoRef.current && videoUrl && !isLoading) {
      videoRef.current.play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch(error => {
          console.log("Autoplay failed:", error);
          setIsPlaying(false);
        });
    }
  }, [videoUrl, setIsPlaying, isLoading]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        if (videoRef.current.ended) {
          videoRef.current.currentTime = 0;
        }
        videoRef.current.play()
          .then(() => {
            setIsPlaying(true);
          })
          .catch(error => {
            console.log("Play failed:", error);
            setIsPlaying(false);
          });
      }
    }
  };

  const handleVideoEnd = () => {
    setIsPlaying(false);
    setVideoEnded(true);
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const progress = (videoRef.current.currentTime / videoRef.current.duration) * 100;
      setProgress(progress);
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (videoRef.current) {
      const bar = e.currentTarget;
      const rect = bar.getBoundingClientRect();
      const percentage = (e.clientX - rect.left) / rect.width;
      const newTime = videoRef.current.duration * percentage;
      videoRef.current.currentTime = newTime;
      setProgress(percentage * 100);
    }
  };

  if (isLoading) {
    return (
      <div className="absolute inset-0 w-full h-full bg-black flex items-center justify-center">
        <div className="w-20 h-20 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (!videoUrl) return null;

  return (
    <div className="absolute inset-0 w-full h-full bg-black flex items-center justify-center" onClick={togglePlay}>
      <div className="relative flex flex-col">
        <video
          ref={videoRef}
          src={videoUrl}
          className="max-w-full max-h-full w-auto h-auto object-contain"
          playsInline
          controls={false}
          onEnded={handleVideoEnd}
          onTimeUpdate={handleTimeUpdate}
          onPlay={() => {
            setIsPlaying(true);
            setVideoEnded(false);
          }}
          onPause={() => setIsPlaying(false)}
        />
        
        <div 
          className="relative h-1 bg-gray-700 cursor-pointer group mt-2"
          onClick={(e) => e.stopPropagation()}
          onMouseDown={handleSeek}
        >
          <div 
            className="h-full bg-white transition-all duration-100"
            style={{ width: `${progress}%` }}
          />
          <div className="absolute bottom-0 left-0 right-0 h-4 -top-3 opacity-0 group-hover:opacity-100">
            <div 
              className="absolute bottom-0 h-1 bg-white/30 w-full"
              onMouseDown={handleSeek}
            />
          </div>
        </div>

        <AnimatePresence>
          {(!isPlaying || isLoading) && !videoEnded && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-20 h-20 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                {isLoading ? (
                  <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <svg 
                    className="w-12 h-12 text-white" 
                    fill="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                )}
              </div>
            </div>
          )}

          {videoEnded && (
            <motion.div 
              initial={{ opacity: 0, x: 0 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/70 flex items-center justify-center"
            >
              <motion.div 
                className="flex flex-col items-center gap-4"
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
              >
                <motion.div
                  animate={{ x: [0, 20, 0] }}
                  transition={{ 
                    repeat: Infinity, 
                    duration: 1.5,
                    ease: "easeInOut" 
                  }}
                  className="flex items-center gap-3 bg-white/10 backdrop-blur-sm px-6 py-4 rounded-lg"
                >
                  <span className="text-white text-lg font-medium">
                    show what you've learned!
                  </span>
                  <svg 
                    className="w-6 h-6 text-white" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M13 7l5 5m0 0l-5 5m5-5H6" 
                    />
                  </svg>
                </motion.div>
                <button
                  onClick={() => setVideoEnded(false)}
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Replay video
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}