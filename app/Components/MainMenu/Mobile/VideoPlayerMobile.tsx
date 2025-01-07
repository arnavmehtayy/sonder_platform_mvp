import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FastForward, Pause, Play, RotateCcw } from "lucide-react";
import { createClient } from "@/app/utils/supabase/client";
import {
  useStore,
  setIsVideoPlayingSelector,
  setIsVideoEndedSelector,
  getIsVideoEndedSelector,
} from "@/app/store";
import { track } from "@vercel/analytics";

export function MobileVideoPlayer({
  experienceId,
  index,
}: {
  experienceId: number;
  index: number;
}) {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [showPlayButton, setShowPlayButton] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const setIsPlaying = useStore(setIsVideoPlayingSelector);
  const setIsVideoEnded = useStore(setIsVideoEndedSelector);
  const isVideoEnded = useStore(getIsVideoEndedSelector);
  const progressBarRef = useRef<HTMLDivElement>(null);

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
          const {
            data: { publicUrl },
          } = supabase.storage
            .from("experience-videos")
            .getPublicUrl(data.video_path);

          setVideoUrl(publicUrl);
        }
      } catch (error) {
        console.error("Error loading video:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadVideo();
  }, [experienceId, index]);

  useEffect(() => {
    if (videoRef.current && videoUrl && !isLoading) {
      const playTimeout = setTimeout(() => {
        if (videoRef.current) {
          const playPromise = videoRef.current.play();
          if (playPromise !== undefined) {
            playPromise
              .then(() => {
                setIsPlaying(true);
                setShowPlayButton(false);
                setIsVideoEnded(false);
              })
              .catch((error) => {
                console.log("Autoplay failed:", error);
                setIsPlaying(false);
                setShowPlayButton(true);
              });
          }
        }
      }, 100);

      return () => clearTimeout(playTimeout);
    }
  }, [videoUrl, setIsPlaying, isLoading]);

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const progress =
        (videoRef.current.currentTime / videoRef.current.duration) * 100;
      setProgress(progress);
    }
  };

  const handleVideoEnd = () => {
    setIsPlaying(false);
    setIsVideoEnded(true);
    setShowPlayButton(false);
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isVideoEnded) {
        setIsVideoEnded(false);
        videoRef.current.currentTime = 0;
        videoRef.current.play().then(() => {
          setIsPlaying(true);
          setShowPlayButton(false);
        });
      } else if (!videoRef.current.paused) {
        videoRef.current.pause();
        setIsPlaying(false);
        setShowPlayButton(true);
      } else {
        videoRef.current.play().then(() => {
          setIsPlaying(true);
          setShowPlayButton(false);
        });
      }
    }
  };

  const handleSkipVideo = () => {
    if (videoRef.current) {
      track("video_skipped", {
        experienceId,
        index,
        timeWatched: videoRef.current.currentTime,
        totalDuration: videoRef.current.duration,
      });

      videoRef.current.currentTime = videoRef.current.duration - 0.1;
      videoRef.current.play();
    }
  };

  const handleReplay = () => {
    if (videoRef.current) {
      setIsVideoEnded(false);
      setShowPlayButton(false);
      videoRef.current.currentTime = 0;

      setTimeout(() => {
        if (videoRef.current) {
          const playPromise = videoRef.current.play();
          if (playPromise !== undefined) {
            playPromise
              .then(() => {
                setIsPlaying(true);
              })
              .catch((error) => {
                console.log("Replay failed:", error);
                setIsPlaying(false);
                setShowPlayButton(true);
              });
          }
        }
      }, 50);
    }
  };

  const handleProgressBarInteraction = (
    event: React.MouseEvent | React.TouchEvent
  ) => {
    if (videoRef.current && progressBarRef.current) {
      // Get the progress bar dimensions
      const rect = progressBarRef.current.getBoundingClientRect();

      // Get the x position of the interaction
      const clientX =
        "touches" in event ? event.touches[0].clientX : event.clientX;

      // Calculate the new position as a percentage
      const position = Math.max(
        0,
        Math.min(1, (clientX - rect.left) / rect.width)
      );

      // Update video time
      videoRef.current.currentTime = position * videoRef.current.duration;

      // Update progress state
      setProgress(position * 100);

      // Reset video ended state if user drags back
      if (isVideoEnded && position < 1) {
        setIsVideoEnded(false);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-20 h-20 bg-black/50 rounded-full flex items-center justify-center backdrop-blur-sm">
            <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin" />
          </div>
          <p className="text-white/80 text-sm font-medium">Loading video...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full bg-black">
      <video
        ref={videoRef}
        src={videoUrl || undefined}
        className="w-full h-full object-contain"
        playsInline
        webkit-playsinline="true"
        x-webkit-airplay="deny"
        disablePictureInPicture
        controls={false}
        preload="auto"
        style={{
          WebkitBackfaceVisibility: "hidden",
          WebkitAppearance: "none",
        }}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleVideoEnd}
        onClick={togglePlay}
      />

      {/* Mobile-optimized controls */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent pb-[calc(env(safe-area-inset-bottom)+1rem)] px-4">
        {/* Progress bar */}
        <div
          ref={progressBarRef}
          className="w-full h-8 flex items-center cursor-pointer touch-none mb-2"
          onTouchStart={handleProgressBarInteraction}
          onTouchMove={handleProgressBarInteraction}
          onClick={handleProgressBarInteraction}
        >
          <div className="w-full h-1 bg-white/30 rounded-full relative">
            <div
              className="absolute h-full bg-white rounded-full transition-all duration-100"
              style={{ width: `${progress}%` }}
            />
            {/* Draggable thumb */}
            <div
              className="absolute h-3 w-3 bg-sky-500 rounded-full -mt-1 shadow-sm transform -translate-x-1/2"
              style={{ left: `${progress}%` }}
            />
          </div>
        </div>

        {/* Control buttons container */}
        <div className="flex justify-center gap-4 mb-safe">
          {/* Play/Pause button */}
          <AnimatePresence>
            {showPlayButton && !isVideoEnded && (
              <div className="flex flex-col items-center">
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  onClick={togglePlay}
                  className="bg-black/50 backdrop-blur-sm rounded-full p-6"
                >
                  <Play className="w-8 h-8 text-white" />
                </motion.button>
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-white/80 text-xs mt-1"
                />
              </div>
            )}
          </AnimatePresence>

          {/* Skip/Replay button */}
          <AnimatePresence mode="wait">
            {isVideoEnded ? (
              <div className="flex flex-col items-center">
                <motion.button
                  key="replay"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  onClick={handleReplay}
                  className="bg-black/50 backdrop-blur-sm rounded-full p-6"
                >
                  <RotateCcw className="w-8 h-8 text-white" />
                </motion.button>
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-white/80 text-xs mt-1"
                />
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <motion.button
                  key="skip"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  onClick={handleSkipVideo}
                  className="bg-black/50 backdrop-blur-sm rounded-full p-6"
                >
                  <FastForward className="w-8 h-8 text-white" />
                </motion.button>
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-white/80 text-xs mt-1"
                >
                  Skip to questions
                </motion.span>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
