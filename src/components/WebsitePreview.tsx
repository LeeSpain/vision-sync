import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  ExternalLink, 
  Maximize2, 
  Minimize2, 
  AlertTriangle, 
  RefreshCw,
  Monitor,
  Smartphone,
  Tablet
} from 'lucide-react';

interface WebsitePreviewProps {
  url: string;
  title: string;
  className?: string;
}

const WebsitePreview: React.FC<WebsitePreviewProps> = ({ url, title, className = '' }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  // Clean URL and add protocol if missing
  const cleanUrl = url.startsWith('http') ? url : `https://${url}`;

  const handleIframeLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  const handleIframeError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  // Add timeout to detect failed loads
  useEffect(() => {
    const timer = setTimeout(() => {
      if (isLoading) {
        setIsLoading(false);
        setHasError(true);
      }
    }, 10000); // 10 second timeout

    return () => clearTimeout(timer);
  }, [isLoading]);

  const refreshPreview = () => {
    setIsLoading(true);
    setHasError(false);
    // Force iframe refresh by updating key
    const iframe = document.querySelector('.website-preview-iframe') as HTMLIFrameElement;
    if (iframe) {
      iframe.src = iframe.src;
    }
  };

  const openInNewTab = () => {
    window.open(cleanUrl, '_blank', 'noopener,noreferrer');
  };

  const getViewportClasses = () => {
    switch (viewMode) {
      case 'mobile':
        return 'max-w-sm mx-auto';
      case 'tablet':
        return 'max-w-2xl mx-auto';
      default:
        return 'w-full';
    }
  };

  const getIframeHeight = () => {
    if (isFullscreen) return 'calc(100vh - 200px)';
    switch (viewMode) {
      case 'mobile':
        return '600px';
      case 'tablet':
        return '500px';
      default:
        return '600px';
    }
  };

  return (
    <Card className={`${className} ${isFullscreen ? 'fixed inset-4 z-50 bg-background' : 'relative'}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CardTitle className="text-lg">Live Preview</CardTitle>
            <Badge variant="outline" className="text-xs">
              {cleanUrl}
            </Badge>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Viewport Controls */}
            <div className="flex items-center gap-1 bg-muted rounded-md p-1">
              <Button
                variant={viewMode === 'desktop' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('desktop')}
                className="h-7 w-7 p-0"
              >
                <Monitor className="h-3 w-3" />
              </Button>
              <Button
                variant={viewMode === 'tablet' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('tablet')}
                className="h-7 w-7 p-0"
              >
                <Tablet className="h-3 w-3" />
              </Button>
              <Button
                variant={viewMode === 'mobile' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('mobile')}
                className="h-7 w-7 p-0"
              >
                <Smartphone className="h-3 w-3" />
              </Button>
            </div>

            {/* Action Controls */}
            <Button
              variant="outline"
              size="sm"
              onClick={refreshPreview}
              disabled={isLoading}
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={openInNewTab}
            >
              <ExternalLink className="h-4 w-4" />
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsFullscreen(!isFullscreen)}
            >
              {isFullscreen ? (
                <Minimize2 className="h-4 w-4" />
              ) : (
                <Maximize2 className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className={`transition-all duration-300 ${getViewportClasses()}`}>
          {hasError ? (
            <div className="flex flex-col items-center justify-center p-8 text-center space-y-4 bg-muted rounded-b-lg">
              <AlertTriangle className="h-12 w-12 text-muted-foreground" />
              <div>
                <p className="font-medium text-foreground">Unable to load preview</p>
                <p className="text-sm text-muted-foreground mt-1">
                  This website may block embedding or have security restrictions.
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={refreshPreview}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Retry
                </Button>
                <Button size="sm" onClick={openInNewTab}>
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Open Directly
                </Button>
              </div>
            </div>
          ) : (
            <div className="relative">
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-muted rounded-b-lg z-10">
                  <div className="flex flex-col items-center space-y-3">
                    <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Loading {title}...</p>
                  </div>
                </div>
              )}
              
              <iframe
                src={cleanUrl}
                title={`Preview of ${title}`}
                className="website-preview-iframe w-full border-0 rounded-b-lg"
                style={{ height: getIframeHeight() }}
                onLoad={handleIframeLoad}
                onError={handleIframeError}
                sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
                loading="lazy"
              />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default WebsitePreview;