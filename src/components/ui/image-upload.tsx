import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Upload, X, ImageIcon, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ImageUploadProps {
  currentUrl?: string;
  onImageChange: (url: string) => void;
  label: string;
  description?: string;
  className?: string;
}

export function ImageUpload({ 
  currentUrl, 
  onImageChange, 
  label, 
  description,
  className = ""
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const uploadImage = async (file: File) => {
    try {
      setUploading(true);
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please upload an image file');
        return;
      }

      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB');
        return;
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `project-images/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('project-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('project-images')
        .getPublicUrl(filePath);

      onImageChange(data.publicUrl);
      toast.success('Image uploaded successfully');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      uploadImage(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      uploadImage(e.target.files[0]);
    }
  };

  const removeImage = () => {
    onImageChange('');
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <label className="block text-sm font-medium">{label}</label>
      {description && (
        <p className="text-xs text-muted-foreground">{description}</p>
      )}
      
      {currentUrl ? (
        <Card className="relative group">
          <div className="relative">
            <img 
              src={currentUrl} 
              alt="Preview" 
              className="w-full h-48 object-cover rounded-lg"
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => document.getElementById(`file-input-${label}`)?.click()}
                  disabled={uploading}
                >
                  {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                  Replace
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={removeImage}
                >
                  <X className="h-4 w-4" />
                  Remove
                </Button>
              </div>
            </div>
          </div>
        </Card>
      ) : (
        <Card 
          className={`border-2 border-dashed p-8 text-center cursor-pointer transition-colors ${
            dragActive ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => document.getElementById(`file-input-${label}`)?.click()}
        >
          <div className="flex flex-col items-center gap-4">
            {uploading ? (
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
            ) : (
              <ImageIcon className="h-12 w-12 text-muted-foreground" />
            )}
            <div>
              <p className="text-sm font-medium">
                {uploading ? 'Uploading...' : 'Drop image here or click to upload'}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Supports: JPEG, PNG, WebP (max 5MB)
              </p>
            </div>
          </div>
        </Card>
      )}

      <input
        id={`file-input-${label}`}
        type="file"
        accept="image/*"
        onChange={handleFileInput}
        className="hidden"
        disabled={uploading}
      />
    </div>
  );
}