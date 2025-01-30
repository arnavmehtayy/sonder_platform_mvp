// import { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { RefreshCw } from "lucide-react";
// import { toast } from "sonner";
// import { useStore, setIsVideoEndedSelector } from "@/app/store";
// import { createClient } from "@/app/utils/supabase/client";

// interface VideoUploadProps {
//   experienceId: number;
//   index: number;
// }

// export function VideoUpload({ experienceId, index }: VideoUploadProps) {
//   const [uploading, setUploading] = useState(false);
//   const setIsVideoEnded = useStore(setIsVideoEndedSelector);

//   const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
//     try {
//       setUploading(true);
//       const file = event.target.files?.[0];

//       if (!file) return;

//       // Check file type
//       if (!file.type.startsWith("video/")) {
//         toast.error("Please upload a video file");
//         return;
//       }

//       // Check file size (50MB limit)
//       if (file.size > 50 * 1024 * 1024) {
//         toast.error("Video must be less than 50MB");
//         return;
//       }

//       const timestamp = Date.now();
//       const fileExtension = file.name.split(".").pop();
//       const fileName = `video_${timestamp}.${fileExtension}`;
//       const filePath = `${experienceId}/${index}/${fileName}`;

//       // Get the bucket name for this experience
//       const bucketResponse = await fetch(
//         `/api/supabase/video?experienceId=${experienceId}&index=${index}`
//       );
//       const bucketData = await bucketResponse.json();
//       if (!bucketResponse.ok) {
//         throw new Error(`Failed to get bucket info: ${bucketData.error}`);
//       }
//       const bucketName = bucketData.bucket_name || "experience-videos";

//       // Upload to the correct bucket
//       const supabase = createClient();
//       const { error: uploadError } = await supabase.storage
//         .from(bucketName)
//         .upload(filePath, file);

//       if (uploadError) throw uploadError;

//       // Update database with new video path
//       const response = await fetch("/api/supabase/video", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           experienceId: experienceId.toString(),
//           index: parseInt(index.toString()),
//           filePath: filePath,
//         }),
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(`Failed to update database: ${errorData.error}`);
//       }

//       // Reset video ended state to trigger reload
//       setIsVideoEnded(false);

//       toast.success("Video replaced successfully");

//       // Force reload the page to update the video
//       window.location.reload();
//     } catch (error) {
//       console.error("Error uploading video:", error);
//       toast.error("Failed to replace video");
//     } finally {
//       setUploading(false);
//     }
//   };

//   return (
//     <div className="flex items-center gap-2">
//       <input
//         type="file"
//         accept="video/*"
//         onChange={handleUpload}
//         className="hidden"
//         id="video-upload"
//         disabled={uploading}
//       />
//       <label htmlFor="video-upload">
//         <Button
//           variant="outline"
//           className="cursor-pointer bg-black/50 hover:bg-black/70 text-white border-none"
//           disabled={uploading}
//           asChild
//         >
//           <div className="flex items-center gap-2">
//             <RefreshCw size={16} className={uploading ? "animate-spin" : ""} />
//             {uploading ? "Replacing..." : "Replace Video"}
//           </div>
//         </Button>
//       </label>
//     </div>
//   );
// }
