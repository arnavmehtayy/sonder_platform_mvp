"use client";
import { useState, useRef, useEffect } from "react";
import { Camera, X, RefreshCw, CheckCircle } from "lucide-react";

interface CameraRecorderProps {
  onSave: (recordedBlob: Blob) => void;
  onCancel: () => void;
}

export function CameraRecorder({ onSave, onCancel }: CameraRecorderProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const previewVideoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [facingMode, setFacingMode] = useState<"user" | "environment">("user");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const timerRef = useRef<number | null>(null);
  const recordedBlobRef = useRef<Blob | null>(null);
  const startTimeRef = useRef<number | null>(null);

  // Initialize camera
  useEffect(() => {
    startCamera();
    return () => {
      stopMediaTracks();
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
      }
    };
  }, [facingMode]);

  // Effect to handle preview video
  useEffect(() => {
    if (previewUrl && previewVideoRef.current) {
      previewVideoRef.current.src = previewUrl;
      previewVideoRef.current.load();

      const playPromise = previewVideoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.error("Error playing preview:", error);
        });
      }
    }
  }, [previewUrl]);

  const startCamera = async () => {
    try {
      stopMediaTracks();

      // Match device aspect ratio
      const constraints = {
        audio: true,
        video: {
          facingMode: facingMode,
          width: { ideal: window.innerWidth },
          height: { ideal: window.innerHeight },
          aspectRatio: { ideal: window.innerWidth / window.innerHeight },
        },
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
    }
  };

  const stopMediaTracks = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
    }
  };

  const startRecording = () => {
    setCountdown(3);

    const countdownInterval = setInterval(() => {
      setCountdown((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(countdownInterval);
          initiateRecording();
          return null;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const initiateRecording = () => {
    if (!videoRef.current?.srcObject) return;

    setRecordedChunks([]);
    setRecordingTime(0);
    setIsRecording(true);
    startTimeRef.current = Date.now();

    const stream = videoRef.current.srcObject as MediaStream;

    // Try to use a widely supported format
    let options;
    if (MediaRecorder.isTypeSupported("video/webm")) {
      options = { mimeType: "video/webm" };
    } else if (MediaRecorder.isTypeSupported("video/mp4")) {
      options = { mimeType: "video/mp4" };
    }

    try {
      mediaRecorderRef.current = options
        ? new MediaRecorder(stream, options)
        : new MediaRecorder(stream);

      console.log(
        "Recording with MIME type:",
        mediaRecorderRef.current.mimeType
      );
    } catch (e) {
      console.error("Failed to create MediaRecorder", e);
      return;
    }

    // Store all chunks
    const chunks: Blob[] = [];

    mediaRecorderRef.current.ondataavailable = (event) => {
      if (event.data && event.data.size > 0) {
        chunks.push(event.data);
        setRecordedChunks(chunks);
      }
    };

    mediaRecorderRef.current.onstop = () => {
      if (chunks.length > 0) {
        const mimeType = mediaRecorderRef.current?.mimeType || "video/webm";
        const blob = new Blob(chunks, { type: mimeType });
        recordedBlobRef.current = blob;

        const url = URL.createObjectURL(blob);
        setPreviewUrl(url);
      }
    };

    // Start recording with frequent data collection
    mediaRecorderRef.current.start(1000);

    // Use window.setInterval for more accurate timing
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
    }

    timerRef.current = window.setInterval(() => {
      const elapsedSeconds = Math.floor(
        (Date.now() - (startTimeRef.current || 0)) / 1000
      );
      setRecordingTime(elapsedSeconds);
    }, 1000);
  };

  const stopRecording = () => {
    if (
      !mediaRecorderRef.current ||
      mediaRecorderRef.current.state === "inactive"
    ) {
      return;
    }

    setIsRecording(false);

    if (timerRef.current) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }

    mediaRecorderRef.current.stop();
  };

  const handleSave = () => {
    if (recordedBlobRef.current) {
      onSave(recordedBlobRef.current);
    } else if (recordedChunks.length > 0) {
      const mimeType = mediaRecorderRef.current?.mimeType || "video/webm";
      const blob = new Blob(recordedChunks, { type: mimeType });
      onSave(blob);
    } else {
      console.error("No recorded data available to save");
    }
  };

  const resetRecording = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
    setRecordedChunks([]);
    recordedBlobRef.current = null;
    startCamera();
  };

  const toggleCamera = () => {
    setFacingMode((prev) => (prev === "user" ? "environment" : "user"));
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div className="relative w-full h-full bg-black flex flex-col">
      {/* Camera preview or recorded video */}
      <div className="relative flex-1 overflow-hidden">
        {previewUrl ? (
          <div className="w-full h-full">
            <video
              ref={previewVideoRef}
              className="absolute inset-0 w-full h-full object-contain"
              autoPlay
              loop
              playsInline
              muted={false}
              controls
            />
            <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/70 to-transparent p-4">
              <h2 className="text-white font-medium text-center">
                Preview Recording
              </h2>
            </div>
          </div>
        ) : (
          <video
            ref={videoRef}
            className="absolute inset-0 w-full h-full object-cover"
            autoPlay
            playsInline
            muted
          />
        )}

        {/* Countdown overlay */}
        {countdown !== null && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10">
            <div className="text-white text-7xl font-bold">{countdown}</div>
          </div>
        )}

        {/* Recording indicator */}
        {isRecording && (
          <div className="absolute top-6 left-0 right-0 flex justify-center items-center z-10">
            <div className="bg-black/70 px-4 py-2 rounded-full flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></div>
              <span className="text-white font-medium">
                {formatTime(recordingTime)}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="bg-black p-4 pb-safe flex items-center justify-between">
        {previewUrl ? (
          <>
            {/* Preview mode controls */}
            <button
              onClick={resetRecording}
              className="p-3 rounded-full bg-white/20"
            >
              <RefreshCw className="w-6 h-6 text-white" />
            </button>

            <button
              onClick={handleSave}
              className="p-4 rounded-full bg-green-500 flex items-center justify-center"
            >
              <CheckCircle className="w-8 h-8 text-white" />
            </button>

            <button onClick={onCancel} className="p-3 rounded-full bg-white/20">
              <X className="w-6 h-6 text-white" />
            </button>
          </>
        ) : (
          <>
            {/* Recording mode controls */}
            <button onClick={onCancel} className="p-3 rounded-full bg-white/20">
              <X className="w-6 h-6 text-white" />
            </button>

            {isRecording ? (
              <button
                onClick={stopRecording}
                className="p-4 rounded-full border-4 border-red-500 flex items-center justify-center"
              >
                <div className="w-8 h-8 bg-red-500 rounded-lg"></div>
              </button>
            ) : (
              <button
                onClick={startRecording}
                className="p-4 rounded-full bg-red-500 flex items-center justify-center"
              >
                <div className="w-8 h-8 rounded-full border-2 border-white"></div>
              </button>
            )}

            <button
              onClick={toggleCamera}
              className="p-3 rounded-full bg-white/20"
            >
              <Camera className="w-6 h-6 text-white" />
            </button>
          </>
        )}
      </div>

      {/* Preview mode labels */}
      {previewUrl && (
        <div className="absolute bottom-20 left-0 right-0 flex justify-between px-8">
          <span className="text-white text-xs font-medium">Try Again</span>
          <span className="text-white text-xs font-medium">Upload</span>
          <span className="text-white text-xs font-medium">Cancel</span>
        </div>
      )}
    </div>
  );
}
