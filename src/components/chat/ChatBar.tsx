import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MessageCircle, Sparkles } from "lucide-react";

interface ChatBarProps {
  onOpenChat: () => void;
}

const ChatBar: React.FC<ChatBarProps> = ({ onOpenChat }) => {
  return (
    <div className="bg-gradient-to-r from-midnight-navy via-midnight-navy/95 to-royal-purple/90 border-b border-white/10 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-12 sm:h-14">
          {/* Left side - Paul's info */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <Avatar className="h-8 w-8 sm:h-9 sm:w-9 ring-2 ring-white/30 ring-offset-1 ring-offset-midnight-navy">
                <AvatarImage 
                  src="/lovable-uploads/afb9cb1e-a617-48d7-b0bf-062beac34324.png" 
                  alt="Paul"
                  className="object-cover"
                />
                <AvatarFallback className="bg-gradient-to-br from-royal-purple to-electric-blue text-white font-bold text-sm">
                  P
                </AvatarFallback>
              </Avatar>
              {/* Online indicator */}
              <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 bg-emerald-500 rounded-full border-2 border-midnight-navy animate-pulse"></div>
            </div>
            
            <div className="hidden sm:block">
              <div className="flex items-center gap-2">
                <span className="text-white font-semibold text-sm">Paul</span>
                <span className="text-white/60 text-xs hidden md:inline">|</span>
                <span className="text-white/60 text-xs hidden md:inline">Your Personal Advisor</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="h-1.5 w-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                <span className="text-emerald-400 text-xs font-medium">Available now</span>
              </div>
            </div>
          </div>
          
          {/* Center message - hidden on mobile */}
          <div className="hidden md:flex items-center gap-2 text-white/80">
            <Sparkles className="h-4 w-4 text-amber-400" />
            <span className="text-sm">Have a question? I'm here to help with any enquiry</span>
          </div>
          
          {/* Right side - CTA button */}
          <Button
            onClick={onOpenChat}
            size="sm"
            className="bg-gradient-to-r from-coral-orange to-coral-orange/80 hover:from-coral-orange/90 hover:to-coral-orange/70 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover-scale gap-2 px-4 sm:px-5"
          >
            <MessageCircle className="h-4 w-4" />
            <span className="hidden sm:inline">Chat with Paul</span>
            <span className="sm:hidden">Chat</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatBar;
