import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Loader2, Sparkles, CheckCircle2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const businessTemplates = [
  {
    title: 'Hair Salon & Spa',
    category: 'Beauty & Personal Care',
    industry: 'Hairdressing & Beauty',
    description: 'Complete booking and client management system for hair salons and spas',
    features: ['Online Booking System', 'Client Management', 'Service Menu', 'Stylist Profiles', 'Gallery Portfolio', 'Appointment Reminders'],
    complexity_level: 'medium',
    estimated_hours: 40,
    pricing: { base: 2500, customization: 800, subscription: { monthly: 49, annually: 490 }, deposit: { amount: 750, percentage: 30 } },
    is_popular: true,
    imagePrompt: 'Professional hair salon interior, modern styling chairs, elegant mirrors, warm lighting, sleek reception area, high-end beauty salon atmosphere, 16:9 aspect ratio'
  },
  {
    title: 'Coffee Shop & Cafe',
    category: 'Food & Beverage',
    industry: 'Restaurant & Food Service',
    description: 'Modern cafe website with online ordering and menu showcase',
    features: ['Digital Menu', 'Online Ordering', 'Loyalty Program', 'Location Finder', 'Instagram Feed', 'Event Calendar'],
    complexity_level: 'medium',
    estimated_hours: 35,
    pricing: { base: 2200, customization: 700, subscription: { monthly: 39, annually: 390 }, deposit: { amount: 660, percentage: 30 } },
    is_popular: true,
    imagePrompt: 'Cozy modern coffee shop interior, artisan coffee bar, pastry display, comfortable seating area, natural wood finishes, warm ambient lighting, 16:9 aspect ratio'
  },
  {
    title: 'Auto Repair Shop',
    category: 'Automotive',
    industry: 'Home Services',
    description: 'Service booking and vehicle maintenance tracking for auto repair businesses',
    features: ['Service Booking', 'Vehicle History', 'Price Estimates', 'Customer Portal', 'Service Packages', 'Team Profiles'],
    complexity_level: 'medium',
    estimated_hours: 45,
    pricing: { base: 2800, customization: 900, subscription: { monthly: 59, annually: 590 }, deposit: { amount: 840, percentage: 30 } },
    is_popular: false,
    imagePrompt: 'Professional auto repair garage, modern car lift equipment, clean workshop, tools organized, mechanic working on vehicle, bright industrial lighting, 16:9 aspect ratio'
  },
  {
    title: 'Pet Grooming & Care',
    category: 'Pet Services',
    industry: 'Home Services',
    description: 'Appointment scheduling and pet profile management for grooming businesses',
    features: ['Pet Profiles', 'Online Booking', 'Service Packages', 'Before/After Gallery', 'Groomer Bios', 'Special Offers'],
    complexity_level: 'simple',
    estimated_hours: 30,
    pricing: { base: 1800, customization: 600, subscription: { monthly: 35, annually: 350 }, deposit: { amount: 540, percentage: 30 } },
    is_popular: false,
    imagePrompt: 'Cheerful pet grooming salon, cute dogs being groomed, colorful and friendly atmosphere, professional grooming equipment, clean and inviting space, 16:9 aspect ratio'
  },
  {
    title: 'Yoga & Fitness Studio',
    category: 'Health & Fitness',
    industry: 'Fitness & Wellness',
    description: 'Class scheduling and membership management for fitness studios',
    features: ['Class Schedule', 'Membership Plans', 'Instructor Profiles', 'Online Booking', 'Video Library', 'Community Forum'],
    complexity_level: 'medium',
    estimated_hours: 42,
    pricing: { base: 2600, customization: 850, subscription: { monthly: 55, annually: 550 }, deposit: { amount: 780, percentage: 30 } },
    is_popular: true,
    imagePrompt: 'Serene yoga studio, natural light streaming through windows, yoga mats arranged, peaceful meditation space, plants and minimalist decor, calming atmosphere, 16:9 aspect ratio'
  },
  {
    title: 'Plumbing Services',
    category: 'Home Services',
    industry: 'Home Services',
    description: 'Emergency service requests and appointment booking for plumbers',
    features: ['Emergency Requests', 'Service Booking', 'Price Calculator', 'Service Areas', 'Customer Reviews', 'Team Directory'],
    complexity_level: 'simple',
    estimated_hours: 28,
    pricing: { base: 1600, customization: 500, subscription: { monthly: 29, annually: 290 }, deposit: { amount: 480, percentage: 30 } },
    is_popular: false,
    imagePrompt: 'Professional plumber at work, modern plumbing tools, clean service van, residential bathroom installation, trustworthy professional appearance, 16:9 aspect ratio'
  },
  {
    title: 'Boutique Clothing Store',
    category: 'Fashion & Retail',
    industry: 'Retail & E-commerce',
    description: 'E-commerce platform for fashion boutiques with inventory management',
    features: ['Product Catalog', 'Shopping Cart', 'Size Guide', 'Wishlist', 'New Arrivals', 'Style Blog'],
    complexity_level: 'complex',
    estimated_hours: 55,
    pricing: { base: 3500, customization: 1200, subscription: { monthly: 79, annually: 790 }, deposit: { amount: 1050, percentage: 30 } },
    is_popular: true,
    imagePrompt: 'Chic fashion boutique interior, elegant clothing displays, modern retail space, stylish mannequins, beautiful lighting, sophisticated shopping atmosphere, 16:9 aspect ratio'
  },
  {
    title: 'Dental Practice',
    category: 'Healthcare',
    industry: 'Healthcare',
    description: 'Patient portal and appointment management for dental offices',
    features: ['Patient Portal', 'Appointment Booking', 'Treatment Info', 'Insurance Info', 'Team Profiles', 'Virtual Consultations'],
    complexity_level: 'medium',
    estimated_hours: 48,
    pricing: { base: 3200, customization: 1000, subscription: { monthly: 69, annually: 690 }, deposit: { amount: 960, percentage: 30 } },
    is_popular: false,
    imagePrompt: 'Modern dental office, clean examination room, advanced dental equipment, comfortable patient chair, professional and welcoming atmosphere, bright clinical lighting, 16:9 aspect ratio'
  },
  {
    title: 'Photography Studio',
    category: 'Creative Services',
    industry: 'Retail & E-commerce',
    description: 'Portfolio showcase and booking system for photographers',
    features: ['Portfolio Gallery', 'Package Pricing', 'Session Booking', 'Client Galleries', 'Blog', 'Contact Forms'],
    complexity_level: 'medium',
    estimated_hours: 38,
    pricing: { base: 2400, customization: 750, subscription: { monthly: 45, annually: 450 }, deposit: { amount: 720, percentage: 30 } },
    is_popular: false,
    imagePrompt: 'Professional photography studio, studio lighting equipment, backdrop setup, camera gear displayed, creative workspace, inspiring artistic environment, 16:9 aspect ratio'
  },
  {
    title: 'Real Estate Agency',
    category: 'Real Estate',
    industry: 'Real Estate',
    description: 'Property listings and agent profiles for real estate agencies',
    features: ['Property Listings', 'Advanced Search', 'Agent Profiles', 'Virtual Tours', 'Mortgage Calculator', 'Neighborhood Guide'],
    complexity_level: 'complex',
    estimated_hours: 60,
    pricing: { base: 4000, customization: 1500, subscription: { monthly: 99, annually: 990 }, deposit: { amount: 1200, percentage: 30 } },
    is_popular: true,
    imagePrompt: 'Luxury real estate office, modern architecture, property showcase displays, professional agents at work, elegant interior design, high-end business atmosphere, 16:9 aspect ratio'
  }
];

interface TemplateSeederProps {
  onSuccess: () => void;
}

export function TemplateSeeder({ onSuccess }: TemplateSeederProps) {
  const [generating, setGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTemplate, setCurrentTemplate] = useState('');
  const [completed, setCompleted] = useState(false);

  const generateImage = async (prompt: string, title: string) => {
    try {
      const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_LOVABLE_API_KEY || ''}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'google/gemini-2.5-flash-image-preview',
          messages: [{
            role: 'user',
            content: prompt
          }],
          modalities: ['image', 'text']
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate image');
      }

      const data = await response.json();
      const imageUrl = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;

      if (!imageUrl) {
        throw new Error('No image generated');
      }

      // Convert base64 to blob
      const base64Data = imageUrl.split(',')[1];
      const byteCharacters = atob(base64Data);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'image/png' });

      // Upload to Supabase Storage
      const fileName = `templates/${title.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}.png`;
      const { error: uploadError } = await supabase.storage
        .from('project-images')
        .upload(fileName, blob);

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from('project-images')
        .getPublicUrl(fileName);

      return urlData.publicUrl;
    } catch (error) {
      console.error('Error generating image:', error);
      return null;
    }
  };

  const generateTemplates = async () => {
    setGenerating(true);
    setProgress(0);
    setCompleted(false);

    try {
      let successCount = 0;

      for (let i = 0; i < businessTemplates.length; i++) {
        const template = businessTemplates[i];
        setCurrentTemplate(template.title);
        setProgress(((i + 1) / businessTemplates.length) * 100);

        // Generate AI image
        const imageUrl = await generateImage(template.imagePrompt, template.title);

        if (!imageUrl) {
          console.warn(`Failed to generate image for ${template.title}, using placeholder`);
        }

        // Create template in database
        const { error } = await supabase
          .from('app_templates')
          .insert({
            title: template.title,
            category: template.category,
            industry: template.industry,
            description: template.description,
            features: template.features,
            complexity_level: template.complexity_level,
            estimated_hours: template.estimated_hours,
            pricing: template.pricing,
            is_popular: template.is_popular,
            is_active: true,
            image_url: imageUrl || '/placeholder.svg'
          });

        if (!error) {
          successCount++;
        } else {
          console.error(`Error creating ${template.title}:`, error);
        }
      }

      setCompleted(true);
      toast.success(`Successfully created ${successCount} templates!`);
      onSuccess();
    } catch (error) {
      console.error('Error generating templates:', error);
      toast.error('Failed to generate templates');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          Generate Sample Templates
        </CardTitle>
        <CardDescription>
          Automatically create 10 everyday business templates with AI-generated images
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!generating && !completed && (
          <Button onClick={generateTemplates} className="w-full">
            <Sparkles className="h-4 w-4 mr-2" />
            Generate 10 Business Templates
          </Button>
        )}

        {generating && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-sm">Generating: {currentTemplate}</span>
            </div>
            <Progress value={progress} />
            <p className="text-xs text-muted-foreground text-center">
              {Math.round(progress)}% Complete
            </p>
          </div>
        )}

        {completed && (
          <div className="flex items-center gap-2 text-green-600">
            <CheckCircle2 className="h-5 w-5" />
            <span>All templates generated successfully!</span>
          </div>
        )}

        <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-muted-foreground">
          {businessTemplates.map((t, i) => (
            <div key={i} className="flex items-center gap-1">
              <span className="w-4 h-4 rounded-full bg-primary/10 flex items-center justify-center text-[10px]">
                {i + 1}
              </span>
              <span>{t.title}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
