"use client";
import { useState, useRef, useEffect } from "react";
import { Camera, X, RefreshCw, CheckCircle, SwitchCamera } from "lucide-react";

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
  const [recordingTime, setRecordingTime] = useState(0);
  const [facingMode, setFacingMode] = useState<"user" | "environment">("user");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const timerRef = useRef<number | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Initialize camera on mount and when camera direction changes
  useEffect(() => {
    // Only start camera if we're not in preview mode
    if (!previewUrl) {
      startCamera();
    }
    return cleanupResources;
  }, [facingMode, previewUrl]);

  const cleanupResources = () => {
    stopMediaTracks();
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    if (timerRef.current) window.clearInterval(timerRef.current);
  };

  const stopMediaTracks = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  };

  const startCamera = async () => {
    try {
      stopMediaTracks();

      const constraints = {
        audio: false, // No audio needed for preview
        video: {
          facingMode,
          // Use standard 16:9 aspect ratio for better compatibility
          width: { ideal: 1280 },
          height: { ideal: 720 },
          aspectRatio: { ideal: 16 / 9 },
        },
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
    }
  };

  const startRecording = async () => {
    stopMediaTracks();

    try {
      // Request both audio and video for recording
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: {
          facingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 },
          aspectRatio: { ideal: 16 / 9 },
        },
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      // Reset recording state
      setRecordedChunks([]);
      setRecordingTime(0);
      setIsRecording(true);

      // Try to use a widely supported format
      const options = MediaRecorder.isTypeSupported(
        "video/webm;codecs=vp9,opus"
      )
        ? { mimeType: "video/webm;codecs=vp9,opus" }
        : MediaRecorder.isTypeSupported("video/webm")
        ? { mimeType: "video/webm" }
        : undefined;

      mediaRecorderRef.current = new MediaRecorder(stream, options);

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
          const url = URL.createObjectURL(blob);
          setPreviewUrl(url);

          if (previewVideoRef.current) {
            previewVideoRef.current.src = url;
            previewVideoRef.current.load();
          }
        }

        // Restart camera preview
        startCamera();
      };

      // Start recording
      mediaRecorderRef.current.start(1000);

      // Update timer
      const startTime = Date.now();
      timerRef.current = window.setInterval(() => {
        setRecordingTime(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
    } catch (err) {
      console.error("Error starting recording:", err);
      startCamera();
    }
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
    if (isUploading) return;
    setIsUploading(true);

    if (recordedChunks.length > 0) {
      const mimeType = mediaRecorderRef.current?.mimeType || "video/webm";
      const blob = new Blob(recordedChunks, { type: mimeType });
      onSave(blob);
    } else {
      console.error("No recorded data available to save");
      setIsUploading(false);
    }
  };

  const resetRecording = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setRecordedChunks([]);
    startCamera();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const toggleCameraFacing = () => {
    if (isRecording) return; // Don't switch camera while recording
    setFacingMode((prev) => (prev === "user" ? "environment" : "user"));
  };

  return (
    <div className="relative w-full h-full bg-black flex flex-col">
      {/* Camera preview or recorded video */}
      <div className="relative flex-1 overflow-hidden">
        {previewUrl ? (
          <div className="w-full h-full">
            <video
              ref={previewVideoRef}
              src={previewUrl}
              className="absolute inset-0 w-full h-full object-contain"
              autoPlay
              loop
              playsInline
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
            className="absolute inset-0 w-full h-full object-contain"
            autoPlay
            playsInline
            muted
          />
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
            <button
              onClick={resetRecording}
              className="p-3 rounded-full bg-white/20"
              disabled={isUploading}
            >
              <RefreshCw className="w-6 h-6 text-white" />
            </button>

            <button
              onClick={handleSave}
              className={`p-4 rounded-full ${
                isUploading ? "bg-gray-500" : "bg-green-500"
              } flex items-center justify-center`}
              disabled={isUploading}
            >
              {isUploading ? (
                <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <CheckCircle className="w-8 h-8 text-white" />
              )}
            </button>

            <button
              onClick={onCancel}
              className="p-3 rounded-full bg-white/20"
              disabled={isUploading}
            >
              <X className="w-6 h-6 text-white" />
            </button>
          </>
        ) : (
          <>
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

            {!isRecording ? (
              <button
                onClick={toggleCameraFacing}
                className="p-3 rounded-full bg-white/20"
              >
                <SwitchCamera className="w-6 h-6 text-white" />
              </button>
            ) : (
              <div className="w-12 h-12"></div> // Empty div to maintain spacing when recording
            )}
          </>
        )}
      </div>
    </div>
  );
}
