import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Share2, Mail, MessageCircle, Twitter, Linkedin, Facebook, Link as LinkIcon } from 'lucide-react';
import { toast } from 'sonner';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface ShareButtonProps {
  variant?: 'default' | 'ghost' | 'outline';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
  fullWidth?: boolean;
}

const ShareButton = ({ variant = 'ghost', size = 'sm', className = '', fullWidth = false }: ShareButtonProps) => {
  const [open, setOpen] = useState(false);

  const shareData = {
    title: 'Vision-Sync Forge',
    text: 'Check out Vision-Sync Forge - Professional AI-powered web development and custom software solutions',
    url: window.location.href,
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share(shareData);
        toast.success('Shared successfully!');
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          toast.error('Failed to share');
        }
      }
    } else {
      setOpen(true);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareData.url).then(() => {
      toast.success('Link copied to clipboard!');
      setOpen(false);
    }).catch(() => {
      toast.error('Failed to copy link');
    });
  };

  const handleSharePlatform = (platform: string) => {
    const encodedUrl = encodeURIComponent(shareData.url);
    const encodedText = encodeURIComponent(shareData.text);
    
    let shareUrl = '';
    
    switch (platform) {
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodedText}%20${encodedUrl}`;
        break;
      case 'email':
        shareUrl = `mailto:?subject=${encodeURIComponent(shareData.title)}&body=${encodedText}%20${encodedUrl}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
        break;
    }
    
    if (shareUrl) {
      window.open(shareUrl, '_blank', 'noopener,noreferrer');
      toast.success('Opening share window...');
      setOpen(false);
    }
  };

  const shareOptions = [
    { icon: MessageCircle, label: 'WhatsApp', action: () => handleSharePlatform('whatsapp'), color: 'text-green-600' },
    { icon: Mail, label: 'Email', action: () => handleSharePlatform('email'), color: 'text-blue-600' },
    { icon: Twitter, label: 'Twitter', action: () => handleSharePlatform('twitter'), color: 'text-sky-500' },
    { icon: Facebook, label: 'Facebook', action: () => handleSharePlatform('facebook'), color: 'text-blue-700' },
    { icon: Linkedin, label: 'LinkedIn', action: () => handleSharePlatform('linkedin'), color: 'text-blue-800' },
    { icon: LinkIcon, label: 'Copy Link', action: handleCopyLink, color: 'text-gray-600' },
  ];

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant={variant} 
          size={size} 
          onClick={handleNativeShare}
          className={fullWidth ? `w-full ${className}` : className}
        >
          <Share2 className="h-4 w-4 mr-1" />
          Share
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-2" align="end">
        <div className="space-y-1">
          <p className="text-sm font-medium px-2 py-1.5 text-muted-foreground">Share via</p>
          {shareOptions.map((option) => (
            <button
              key={option.label}
              onClick={option.action}
              className="w-full flex items-center space-x-3 px-2 py-2 rounded-md hover:bg-accent transition-colors text-left"
            >
              <option.icon className={`h-5 w-5 ${option.color}`} />
              <span className="text-sm font-medium">{option.label}</span>
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default ShareButton;
