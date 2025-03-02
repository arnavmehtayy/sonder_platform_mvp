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
  const [recordingTime, setRecordingTime] = useState(0);
  const [facingMode, setFacingMode] = useState<"user" | "environment">("user");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const timerRef = useRef<number | null>(null);
  const recordedBlobRef = useRef<Blob | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const [deviceOrientation, setDeviceOrientation] = useState<
    "portrait" | "landscape"
  >(window.innerHeight > window.innerWidth ? "portrait" : "landscape");

  // Detect device orientation
  useEffect(() => {
    const handleResize = () => {
      setDeviceOrientation(
        window.innerHeight > window.innerWidth ? "portrait" : "landscape"
      );
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
  }, [facingMode, deviceOrientation]);

  const getVideoConstraints = () => {
    // For mobile phones (portrait mode)
    if (deviceOrientation === "portrait") {
      return {
        facingMode: facingMode,
        width: { ideal: 1080 },
        height: { ideal: 1920 },
        aspectRatio: { ideal: 9 / 16 },
      };
    }
    // For laptops/desktops (landscape mode)
    else {
      return {
        facingMode: facingMode,
        width: { ideal: 1920 },
        height: { ideal: 1080 },
        aspectRatio: { ideal: 16 / 9 },
      };
    }
  };

  const stopMediaTracks = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
    }
  };

  const startCamera = async () => {
    try {
      stopMediaTracks();

      // Only request video for preview (no audio)
      const constraints = {
        audio: false,
        video: getVideoConstraints(),
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
    }
  };

  const startRecording = () => {
    initiateRecording();
  };

  const initiateRecording = async () => {
    if (!videoRef.current?.srcObject) return;

    // Stop the preview-only stream
    stopMediaTracks();

    try {
      // Request both audio and video for recording
      const constraints = {
        audio: true,
        video: getVideoConstraints(),
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      setRecordedChunks([]);
      setRecordingTime(0);
      setIsRecording(true);
      startTimeRef.current = Date.now();

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

          // Make sure the preview video loads the URL
          if (previewVideoRef.current) {
            previewVideoRef.current.src = url;
            previewVideoRef.current.load();
          }
        }

        // Restart camera without audio after recording stops
        startCamera();
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
    } catch (err) {
      console.error("Error starting recording:", err);
      // If recording fails, restart the preview camera
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
    if (isUploading) return; // Prevent multiple uploads

    setIsUploading(true);

    if (recordedBlobRef.current) {
      onSave(recordedBlobRef.current);
    } else if (recordedChunks.length > 0) {
      const mimeType = mediaRecorderRef.current?.mimeType || "video/webm";
      const blob = new Blob(recordedChunks, { type: mimeType });
      onSave(blob);
    } else {
      console.error("No recorded data available to save");
      setIsUploading(false);
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
              src={previewUrl}
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
            {/* Preview mode controls */}
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
    </div>
  );
}
