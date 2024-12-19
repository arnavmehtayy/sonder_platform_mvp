import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';
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

      // Check file size (50MB limit)
      if (file.size > 50 * 1024 * 1024) {
        toast.error('Video must be less than 50MB');
        return;
      }

      const formData = new FormData();
      formData.append('file', file);
      formData.append('experienceId', experienceId.toString());
      formData.append('index', index.toString());

      const response = await fetch('/api/supabase/video', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

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