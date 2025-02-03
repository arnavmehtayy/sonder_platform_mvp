import { useEffect, useRef, useState } from "react";
import { createClient } from "@/app/utils/supabase/client";
import {
  useStore,
  getIsVideoPlayingSelector,
  setIsVideoPlayingSelector,
  setIsVideoEndedSelector,
  getIsVideoEndedSelector,
} from "@/app/store";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

interface VideoPlayerProps {
  experienceId: number;
  index: number;
  isEditMode?: boolean;
}

const VideoLoadingFallback = () => (
  <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
    <div className="flex flex-col items-center gap-4">
      <div className="w-20 h-20 bg-black/50 rounded-full flex items-center justify-center backdrop-blur-sm">
        <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin" />
      </div>
      <p className="text-white/80 text-sm font-medium">Loading video...</p>
    </div>
  </div>
);

export function VideoPlayer({
  experienceId,
  index,
  isEditMode = false,
}: VideoPlayerProps) {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showPlayButton, setShowPlayButton] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const isPlaying = useStore(getIsVideoPlayingSelector);
  const setIsPlaying = useStore(setIsVideoPlayingSelector);
  const isVideoEnded = useStore(getIsVideoEndedSelector);
  const setIsVideoEnded = useStore(setIsVideoEndedSelector);
  const [progress, setProgress] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const controlsTimeoutRef = useRef<NodeJS.Timeout>();
  const [isDragging, setIsDragging] = useState(false);
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
            .from(data.bucket_name)
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

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
        setShowPlayButton(true);
      } else {
        if (videoRef.current.ended) {
          videoRef.current.currentTime = 0;
        }
        videoRef.current
          .play()
          .then(() => {
            setIsPlaying(true);
            setShowPlayButton(false);
          })
          .catch((error) => {
            console.log("Play failed:", error);
            setIsPlaying(false);
            setShowPlayButton(true);
          });
      }
    }
  };

  const handleSkip = (seconds: number) => {
    // if (videoRef.current) {
    //   const newTime = videoRef.current.currentTime + seconds;
    //   videoRef.current.currentTime = Math.min(
    //     Math.max(0, newTime),
    //     videoRef.current.duration
    //   );
    //   setProgress(
    //     (videoRef.current.currentTime / videoRef.current.duration) * 100
    //   );
    // }
  };

  const handleVideoEnd = () => {
    setIsPlaying(false);
    setIsVideoEnded(true);
    setShowPlayButton(false);
  };

  const handleReplay = () => {
    if (videoRef.current) {
      // First reset all states
      setIsVideoEnded(false);
      setShowPlayButton(false);

      // Reset video time
      videoRef.current.currentTime = 0;

      // Create a small delay to ensure state updates have propagated
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

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      // Only update progress if video is actually playing
      if (!videoRef.current.paused) {
        const progress =
          (videoRef.current.currentTime / videoRef.current.duration) * 100;
        setProgress(progress);
      }
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (videoRef.current) {
      const bar = e.currentTarget;
      const rect = bar.getBoundingClientRect();
      const percentage = (e.clientX - rect.left) / rect.width;
      const newTime = videoRef.current.duration * percentage;

      // Pause video before seeking
      videoRef.current.pause();

      // Update time
      videoRef.current.currentTime = newTime;
      setProgress(percentage * 100);

      // Resume playback if it was playing
      if (isPlaying) {
        const playPromise = videoRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch((error) => {
            console.log("Play failed:", error);
          });
        }
      }
    }
  };

  const handleSkipVideo = () => {
    // if (videoRef.current) {
    //   // First pause the video
    //   videoRef.current.pause();
    //   // Mute the video to prevent audio artifacts
    //   const wasMuted = videoRef.current.muted;
    //   videoRef.current.muted = true;
    //   // Set time to end
    //   videoRef.current.currentTime = videoRef.current.duration;
    //   // Reset muted state
    //   setTimeout(() => {
    //     if (videoRef.current) {
    //       videoRef.current.muted = wasMuted;
    //     }
    //   }, 100);
    //   // Trigger ended event manually if needed
    //   handleVideoEnd();
    // }
  };

  const resetControlsTimeout = () => {
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    setShowControls(true);
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
      }
    }, 3000); // Hide after 3 seconds of inactivity
  };

  useEffect(() => {
    // Reset the timeout when play state changes
    resetControlsTimeout();
  }, [isPlaying]);

  useEffect(() => {
    // Cleanup timeout on unmount
    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, []);

  const handleMouseMove = () => {
    resetControlsTimeout();
  };

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      // Show controls when any key is pressed
      resetControlsTimeout();

      switch (e.code) {
        case "Space":
          e.preventDefault();
          if (videoRef.current) {
            if (videoRef.current.paused) {
              videoRef.current.play().then(() => {
                setIsPlaying(true);
                setShowPlayButton(false);
              });
            } else {
              videoRef.current.pause();
              setIsPlaying(false);
              setShowPlayButton(true);
            }
          }
          break;
        case "ArrowRight":
          handleSkip(5);
          break;
        case "ArrowLeft":
          handleSkip(-5);
          break;
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, []);

  const handleProgressBarInteraction = (e: React.MouseEvent) => {
    // if (videoRef.current && progressBarRef.current) {
    //   const rect = progressBarRef.current.getBoundingClientRect();
    //   const position = Math.max(
    //     0,
    //     Math.min(1, (e.clientX - rect.left) / rect.width)
    //   );
    //   // Update video time
    //   videoRef.current.currentTime = position * videoRef.current.duration;
    //   // Update progress state
    //   setProgress(position * 100);
    //   // Reset video ended state if user drags back
    //   if (isVideoEnded && position < 1) {
    //     setIsVideoEnded(false);
    //   }
    // }
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        e.preventDefault();
        handleProgressBarInteraction(e as unknown as React.MouseEvent);
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging]);

  if (isLoading) {
    return <VideoLoadingFallback />;
  }

  if (!videoUrl) return null;

  return (
    <div
      className="absolute inset-0 w-full h-full bg-black flex items-center justify-center"
      onClick={togglePlay}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setShowControls(true)}
    >
      <div className="relative flex flex-col w-full h-full">
        <div className="relative w-full h-full">
          <video
            ref={videoRef}
            src={videoUrl}
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
            onEnded={handleVideoEnd}
            onTimeUpdate={handleTimeUpdate}
            onPlay={() => {
              setIsPlaying(true);
              setIsVideoEnded(false);
              setShowPlayButton(false);
            }}
            onPause={() => {
              setIsPlaying(false);
              setShowPlayButton(true);
            }}
          />
        </div>

        <AnimatePresence>
          {showPlayButton && !isVideoEnded && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <div className="w-20 h-20 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                {isLoading ? (
                  <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <svg
                    className="w-12 h-12 text-white"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {!isVideoEnded && (
          <div
            className={`absolute ${
              isEditMode ? "bottom-20" : "bottom-0"
            } left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4 transition-opacity duration-300 ${
              showControls ? "opacity-100" : "opacity-0"
            }`}
            style={{ zIndex: 25 }}
          >
            <div className="flex items-center gap-4 mb-1">
              <div
                ref={progressBarRef}
                className={`w-full relative h-8 flex items-center ${
                  isEditMode ? "cursor-pointer" : "cursor-default"
                }`}
                onClick={isEditMode ? handleSeek : undefined}
              >
                <div className="w-full h-1 bg-white/30 rounded-full relative">
                  <div
                    className="absolute h-full bg-white rounded-full transition-all duration-100"
                    style={{ width: `${progress}%` }}
                  />
                  {isEditMode && (
                    <div
                      className="absolute h-3 w-3 bg-sky-500 rounded-full -mt-1 shadow-sm transform -translate-x-1/2"
                      style={{ left: `${progress}%` }}
                      onMouseDown={(e) => {
                        e.stopPropagation();
                        setIsDragging(true);
                      }}
                    />
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  togglePlay();
                }}
                className="text-white hover:text-white/80 transition-colors"
              >
                {isPlaying ? (
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fillRule="evenodd"
                      d="M6.75 5.25a.75.75 0 01.75-.75H9a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H7.5a.75.75 0 01-.75-.75V5.25zm7.5 0A.75.75 0 0115 4.5h1.5a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H15a.75.75 0 01-.75-.75V5.25z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </button>

              {/* Comment out skip buttons
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleSkip(-5);
                }}
                className="text-white hover:text-white/80 transition-colors flex items-center gap-1"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0019 16V7a1 1 0 00-1.6-.8l-5.333 4zM4.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0011 16V7a1 1 0 00-1.6-.8l-5.334 4z" />
                </svg>
                <span className="text-xs font-medium">5</span>
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleSkip(5);
                }}
                className="text-white hover:text-white/80 transition-colors flex items-center gap-1"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M5 16V7a1 1 0 011.6-.8l5.334 4a1 1 0 010 1.6l-5.334 4A1 1 0 015 16zm12 0V7a1 1 0 011.6-.8l5.334 4a1 1 0 010 1.6l-5.334 4A1 1 0 0117 16z" />
                </svg>
                <span className="text-xs font-medium">5</span>
              </button>
              */}
            </div>
          </div>
        )}

        <AnimatePresence>
          {isVideoEnded && (
            <motion.div
              initial={{ opacity: 0, x: 0 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/35 flex items-end justify-end p-8"
            >
              <motion.div
                className="flex flex-col items-center gap-4"
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
              >
                <motion.div
                  animate={{ x: [0, 20, 0] }}
                  transition={{
                    repeat: 1,
                    duration: 1.5,
                    ease: "easeInOut",
                  }}
                  className="flex items-center gap-3 bg-white/10 backdrop-blur-sm px-6 py-4 rounded-lg"
                >
                  <span className="text-white text-lg font-medium">
                    Apply your knowledge!
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
                  onClick={handleReplay}
                  className="text-white bg-black/50 hover:bg-black/70 px-4 py-2 rounded-md transition-colors text-sm z-50 backdrop-blur-sm"
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
