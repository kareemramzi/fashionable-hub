
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, X, Image } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ImageUploadProps {
  onImageUploaded: (url: string) => void;
  currentImageUrl?: string;
}

const ImageUpload = ({ onImageUploaded, currentImageUrl }: ImageUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(currentImageUrl || "");
  const { toast } = useToast();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select an image smaller than 5MB",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);

    try {
      // Create unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from('product-images')
        .upload(fileName, file);

      if (error) throw error;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(data.path);

      setPreviewUrl(publicUrl);
      onImageUploaded(publicUrl);

      toast({
        title: "Image uploaded successfully",
        description: "Your product image has been uploaded",
      });
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload failed",
        description: "Could not upload the image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setPreviewUrl("");
    onImageUploaded("");
  };

  const handleUrlInput = (url: string) => {
    setPreviewUrl(url);
    onImageUploaded(url);
  };

  return (
    <div className="space-y-4">
      <Label>Product Image</Label>
      
      {/* File Upload */}
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
        <Input
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          disabled={uploading}
          className="hidden"
          id="image-upload"
        />
        <label
          htmlFor="image-upload"
          className="cursor-pointer flex flex-col items-center space-y-2"
        >
          <Upload className="w-8 h-8 text-gray-400" />
          <span className="text-sm text-gray-600">
            {uploading ? "Uploading..." : "Click to upload image or drag and drop"}
          </span>
          <span className="text-xs text-gray-500">PNG, JPG up to 5MB</span>
        </label>
      </div>

      {/* URL Input Alternative */}
      <div className="text-center text-sm text-gray-500">or</div>
      <div>
        <Label htmlFor="image-url-input">Enter Image URL</Label>
        <Input
          id="image-url-input"
          value={previewUrl}
          onChange={(e) => handleUrlInput(e.target.value)}
          placeholder="https://example.com/image.jpg"
        />
      </div>

      {/* Preview */}
      {previewUrl && (
        <div className="relative">
          <Label>Preview</Label>
          <div className="relative border rounded-lg p-2 bg-gray-50">
            <img
              src={previewUrl}
              alt="Product preview"
              className="w-full max-h-48 object-cover rounded"
              onError={() => {
                toast({
                  title: "Invalid image URL",
                  description: "The image URL is not valid or accessible",
                  variant: "destructive",
                });
              }}
            />
            <Button
              type="button"
              size="icon"
              variant="destructive"
              className="absolute top-2 right-2 w-6 h-6"
              onClick={handleRemoveImage}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
