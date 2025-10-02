import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Loader2, ImagePlus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Progress } from '@/components/ui/progress';

interface BulkImageGeneratorProps {
  onComplete: () => void;
}

export function BulkImageGenerator({ onComplete }: BulkImageGeneratorProps) {
  const [generating, setGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTemplate, setCurrentTemplate] = useState('');

  const imagePrompts: Record<string, string> = {
    'Hair Salon Management System': 'Create a modern, professional image for a hair salon booking app. Show a sleek salon interior with styling chairs, mirrors, and elegant decor. Style: Clean, sophisticated, beauty industry focused. Ultra high resolution.',
    'Coffee Shop POS & Loyalty': 'Create a vibrant image for a coffee shop point-of-sale system. Show a modern coffee bar with espresso machines, cups, and a tablet POS system. Style: Warm, inviting, cafe atmosphere. Ultra high resolution.',
    'Auto Repair Shop Manager': 'Create a professional image for an auto repair management system. Show a clean garage with tools, car lifts, and diagnostic equipment. Style: Modern, industrial, automotive focused. Ultra high resolution.',
    'Pet Grooming Scheduler': 'Create a cheerful image for a pet grooming booking app. Show a bright grooming salon with happy pets, grooming tools, and professional equipment. Style: Friendly, clean, pet-care focused. Ultra high resolution.',
    'Fitness Studio Booking': 'Create an energetic image for a fitness studio booking system. Show a modern gym with exercise equipment, yoga mats, and workout spaces. Style: Dynamic, motivating, health-focused. Ultra high resolution.',
    'Restaurant Reservation System': 'Create an elegant image for a restaurant reservation platform. Show a beautiful dining room with tables, ambient lighting, and fine dining setup. Style: Upscale, inviting, hospitality focused. Ultra high resolution.',
    'Dental Practice Manager': 'Create a clean, professional image for a dental practice management system. Show a modern dental office with equipment, waiting area, and treatment rooms. Style: Medical, trustworthy, healthcare focused. Ultra high resolution.',
    'Beauty Spa Appointment Tracker': 'Create a luxurious image for a spa appointment booking system. Show a serene spa environment with treatment rooms, candles, and relaxation spaces. Style: Calming, premium, wellness focused. Ultra high resolution.',
    'Cleaning Service Scheduler': 'Create a fresh, professional image for a cleaning service management app. Show a pristine home interior with cleaning supplies and professional equipment. Style: Clean, organized, service-oriented. Ultra high resolution.',
    'Personal Training Session Manager': 'Create a motivational image for a personal training booking system. Show a professional training environment with weights, equipment, and workout spaces. Style: Energetic, professional, fitness focused. Ultra high resolution.'
  };

  const generateImagesForAllTemplates = async () => {
    setGenerating(true);
    setProgress(0);

    try {
      // Get all templates without images or with placeholder images
      const { data: templates, error: fetchError } = await supabase
        .from('app_templates')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (fetchError) throw fetchError;
      if (!templates || templates.length === 0) {
        toast.error('No templates found');
        return;
      }

      const totalTemplates = templates.length;
      let completed = 0;

      for (const template of templates) {
        setCurrentTemplate(template.title);
        
        const prompt = imagePrompts[template.title] || 
          `Create a modern, professional image for ${template.title}. ${template.description}. Style: Clean, professional, industry-specific design. Ultra high resolution.`;

        try {
          // Generate image using Lovable AI
          const { data: imageData, error: imageError } = await supabase.functions.invoke('generate-template-image', {
            body: { 
              prompt,
              title: template.title
            }
          });

          if (imageError) throw imageError;

          if (imageData?.imageUrl) {
            // Convert base64 to blob
            const base64Response = await fetch(imageData.imageUrl);
            const blob = await base64Response.blob();
            
            // Upload to Supabase storage
            const fileName = `templates/${template.id}-${Date.now()}.png`;
            const { error: uploadError } = await supabase.storage
              .from('project-images')
              .upload(fileName, blob, {
                contentType: 'image/png',
                upsert: true
              });

            if (uploadError) throw uploadError;

            // Get public URL
            const { data: urlData } = supabase.storage
              .from('project-images')
              .getPublicUrl(fileName);

            // Update template with new image URL
            const { error: updateError } = await supabase
              .from('app_templates')
              .update({ image_url: urlData.publicUrl })
              .eq('id', template.id);

            if (updateError) throw updateError;

            console.log(`✓ Generated image for: ${template.title}`);
          }
        } catch (error) {
          console.error(`Failed to generate image for ${template.title}:`, error);
          // Continue with other templates even if one fails
        }

        completed++;
        setProgress((completed / totalTemplates) * 100);
      }

      toast.success(`Successfully generated images for ${completed} templates!`);
      onComplete();
    } catch (error) {
      console.error('Error generating images:', error);
      toast.error('Failed to generate images');
    } finally {
      setGenerating(false);
      setCurrentTemplate('');
      setProgress(0);
    }
  };

  return (
    <Card className="p-6 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-500/20">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <ImagePlus className="h-5 w-5 text-blue-500" />
              Bulk Image Generator
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              Generate AI images for all templates at once
            </p>
          </div>
          
          <Button 
            onClick={generateImagesForAllTemplates}
            disabled={generating}
            size="lg"
          >
            {generating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Generating...
              </>
            ) : (
              <>
                <ImagePlus className="h-4 w-4 mr-2" />
                Generate All Images
              </>
            )}
          </Button>
        </div>

        {generating && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Processing: {currentTemplate}</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}
      </div>
    </Card>
  );
}
