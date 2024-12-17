import { useState } from 'react';
import { createClient } from '@/app/utils/supabase/client';
import { Button } from '@/components/ui/button';
import { Upload, Video } from 'lucide-react';
import { toast } from 'sonner';

interface VideoUploadProps {
  experienceId: number;
  index: number;
}

export function VideoUpload({ experienceId, index }: VideoUploadProps) {
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      const file = event.target.files?.[0];
      
      if (!file) return;

      // Check file type
      if (!file.type.startsWith('video/')) {
        toast.error('Please upload a video file');
        return;
      }

      // Check file size (e.g., 100MB limit)
      if (file.size > 50 * 1024 * 1024) {
        toast.error('Video must be less than 50MB');
        return;
      }

      const supabase = createClient();
      
      // Check if user is authenticated
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error('Please sign in to upload videos');
        return;
      }

      // Upload to Supabase storage
      const { data, error } = await supabase.storage
        .from('experience-videos')
        .upload(`${experienceId}/${index}/video.mp4`, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (error) throw error;

      // Save video reference in the database
      const response = await fetch('/api/supabase/video', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          experienceId,
          index,
          videoPath: data.path
        }),
      });

      if (!response.ok) throw new Error('Failed to save video reference');

      toast.success('Video uploaded successfully');
    } catch (error) {
      console.error('Error uploading video:', error);
      toast.error('Failed to upload video');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <input
        type="file"
        accept="video/*"
        onChange={handleUpload}
        className="hidden"
        id="video-upload"
        disabled={uploading}
      />
      <label htmlFor="video-upload">
        <Button
          variant="outline"
          className="cursor-pointer"
          disabled={uploading}
          asChild
        >
          <div className="flex items-center gap-2">
            <Upload size={16} />
            {uploading ? 'Uploading...' : 'Upload Video'}
          </div>
        </Button>
      </label>
    </div>
  );
}