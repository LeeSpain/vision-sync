import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Loader2, Sparkles, Globe } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface AutoImageGeneratorProps {
  onThumbnailGenerated: (url: string) => void;
  onHeroGenerated: (url: string) => void;
  projectName: string;
  projectDescription: string;
}

export function AutoImageGenerator({ 
  onThumbnailGenerated, 
  onHeroGenerated, 
  projectName, 
  projectDescription 
}: AutoImageGeneratorProps) {
  const [url, setUrl] = useState('');
  const [generating, setGenerating] = useState(false);

  const generateImages = async () => {
    if (!url) {
      toast.error('Please enter a website URL');
      return;
    }

    if (!projectName) {
      toast.error('Please enter a project name first');
      return;
    }

    try {
      setGenerating(true);
      
      // Generate thumbnail image (400x300 - card format)
      const thumbnailPrompt = `Create a modern, professional project thumbnail image for "${projectName}". ${projectDescription ? `Project description: ${projectDescription}. ` : ''}Style: Clean, minimal design with vibrant colors, perfect for a project card. Include subtle tech/digital elements. Format: 4:3 aspect ratio, card-style layout with professional typography and modern UI elements.`;
      
      // Generate hero image (1200x600 - banner format)  
      const heroPrompt = `Create a stunning hero banner image for "${projectName}". ${projectDescription ? `Project description: ${projectDescription}. ` : ''}Style: Modern, premium design with gradients and tech elements. Perfect for a website header. Format: 2:1 aspect ratio, wide banner layout with space for overlay text, professional and engaging.`;

      // Call edge function to generate both images
      const { data: thumbnailData, error: thumbnailError } = await supabase.functions.invoke('generate-project-images', {
        body: { 
          prompt: thumbnailPrompt,
          size: '1024x1024', // OpenAI will crop/adjust as needed
          imageType: 'thumbnail'
        }
      });

      if (thumbnailError) throw thumbnailError;

      const { data: heroData, error: heroError } = await supabase.functions.invoke('generate-project-images', {
        body: { 
          prompt: heroPrompt,
          size: '1792x1024', // Wider format for hero
          imageType: 'hero'
        }
      });

      if (heroError) throw heroError;

      // Upload generated images to Supabase storage
      if (thumbnailData?.imageUrl) {
        const thumbnailResponse = await fetch(thumbnailData.imageUrl);
        const thumbnailBlob = await thumbnailResponse.blob();
        
        const thumbnailFileName = `project-thumbnails/${Date.now()}-${Math.random().toString(36).substring(2)}.png`;
        const { data: thumbnailUpload, error: thumbnailUploadError } = await supabase.storage
          .from('project-images')
          .upload(thumbnailFileName, thumbnailBlob);

        if (thumbnailUploadError) throw thumbnailUploadError;

        const { data: thumbnailUrl } = supabase.storage
          .from('project-images')
          .getPublicUrl(thumbnailFileName);

        onThumbnailGenerated(thumbnailUrl.publicUrl);
      }

      if (heroData?.imageUrl) {
        const heroResponse = await fetch(heroData.imageUrl);
        const heroBlob = await heroResponse.blob();
        
        const heroFileName = `project-heroes/${Date.now()}-${Math.random().toString(36).substring(2)}.png`;
        const { data: heroUpload, error: heroUploadError } = await supabase.storage
          .from('project-images')
          .upload(heroFileName, heroBlob);

        if (heroUploadError) throw heroUploadError;

        const { data: heroUrl } = supabase.storage
          .from('project-images')
          .getPublicUrl(heroFileName);

        onHeroGenerated(heroUrl.publicUrl);
      }

      toast.success('Images generated successfully!');
      setUrl('');
    } catch (error) {
      console.error('Error generating images:', error);
      toast.error('Failed to generate images. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <Card className="p-6 mb-6 bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold">AI Image Generator</h3>
      </div>
      
      <p className="text-sm text-muted-foreground mb-4">
        Generate both thumbnail and hero images automatically using AI based on your project details.
      </p>
      
      <div className="flex gap-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Globe className="h-4 w-4 text-muted-foreground" />
            <label className="text-sm font-medium">Website URL (optional)</label>
          </div>
          <Input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com (helps generate more accurate images)"
            disabled={generating}
          />
        </div>
        
        <Button 
          onClick={generateImages}
          disabled={generating || !projectName}
          className="self-end"
        >
          {generating ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4 mr-2" />
              Generate Images
            </>
          )}
        </Button>
      </div>
      
      {!projectName && (
        <p className="text-xs text-amber-600 mt-2">
          Please enter a project name first to enable image generation
        </p>
      )}
    </Card>
  );
}