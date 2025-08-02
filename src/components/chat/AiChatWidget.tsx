import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageSquare, Send, Mic, MicOff, X, Minimize2, Maximize2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface ChatMessage {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  isTyping?: boolean;
  role?: 'user' | 'assistant';
}

interface AiChatWidgetProps {
  isMinimized?: boolean;
  onToggleMinimize?: () => void;
}

const AiChatWidget: React.FC<AiChatWidgetProps> = ({ 
  isMinimized = true, 
  onToggleMinimize 
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [sessionId] = useState(() => `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
  const [agentData, setAgentData] = useState<any>(null);
  const [contactInfo, setContactInfo] = useState<any>({});
  const [showContactBadge, setShowContactBadge] = useState(false);
  const [welcomeSettings, setWelcomeSettings] = useState({
    message: "Hello! I'm here to help you discover amazing digital solutions. What kind of project are you looking for today?",
    quickActions: ["Tell me about AI solutions", "I need a custom app", "Show me investment opportunities", "I want to discuss pricing"],
    delay: 1000
  });
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognition = useRef<any>(null);

  useEffect(() => {
    loadAgentData();
    loadWelcomeSettings();
    initializeSpeechRecognition();
  }, []);

  useEffect(() => {
    if (welcomeSettings.message && messages.length === 0) {
      setTimeout(() => {
        const greeting: ChatMessage = {
          id: `msg_${Date.now()}`,
          type: 'ai',
          content: welcomeSettings.message,
          timestamp: new Date()
        };
        setMessages([greeting]);
      }, welcomeSettings.delay);
    }
  }, [welcomeSettings, messages.length]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadAgentData = async () => {
    try {
      const { data } = await supabase
        .from('ai_agents')
        .select('*')
        .eq('is_active', true)
        .single();
      
      if (data) {
        setAgentData(data);
      }
    } catch (error) {
      console.error('Error loading agent data:', error);
    }
  };

  const loadWelcomeSettings = async () => {
    try {
      const { data } = await supabase
        .from('ai_agent_settings')
        .select('setting_key, setting_value')
        .in('setting_key', ['welcome_message', 'quick_actions', 'greeting_delay']);
      
      if (data) {
        const settingsMap = data.reduce((acc: any, setting) => {
          acc[setting.setting_key] = setting.setting_value;
          return acc;
        }, {});

        setWelcomeSettings({
          message: settingsMap.welcome_message || "Hello! I'm here to help you discover amazing digital solutions. What kind of project are you looking for today?",
          quickActions: Array.isArray(settingsMap.quick_actions) ? settingsMap.quick_actions : 
                       (typeof settingsMap.quick_actions === 'string' ? JSON.parse(settingsMap.quick_actions) : 
                       ["Tell me about AI solutions", "I need a custom app", "Show me investment opportunities", "I want to discuss pricing"]),
          delay: parseInt(settingsMap.greeting_delay || '1000')
        });
      }
    } catch (error) {
      console.error('Error loading welcome settings:', error);
    }
  };

  const initializeSpeechRecognition = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognition.current = new SpeechRecognition();
      recognition.current.continuous = false;
      recognition.current.interimResults = false;
      recognition.current.lang = 'en-US';

      recognition.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputMessage(transcript);
        setIsListening(false);
      };

      recognition.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        toast.error('Speech recognition failed');
      };

      recognition.current.onend = () => {
        setIsListening(false);
      };
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const sendMessage = async (content: string = inputMessage) => {
    if (!content.trim()) return;

    const userMessage: ChatMessage = {
      id: `msg_${Date.now()}`,
      type: 'user',
      content: content.trim(),
      timestamp: new Date(),
      role: 'user'
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    // Add typing indicator
    const typingMessage: ChatMessage = {
      id: `typing_${Date.now()}`,
      type: 'ai',
      content: 'AI is typing...',
      timestamp: new Date(),
      isTyping: true,
      role: 'assistant'
    };
    setMessages(prev => [...prev, typingMessage]);

    try {
      // Prepare conversation history for API
      const conversationHistory = [...messages, userMessage].map(msg => ({
        role: msg.type === 'user' ? 'user' : 'assistant',
        content: msg.content,
        timestamp: msg.timestamp.toISOString()
      }));

      // Call AI chat endpoint
      const { data, error } = await supabase.functions.invoke('ai-chat', {
        body: {
          message: content,
          sessionId,
          agentId: agentData?.id,
          conversationHistory
        }
      });

      // Remove typing indicator
      setMessages(prev => prev.filter(msg => !msg.isTyping));

      if (error) throw error;

      const aiResponse: ChatMessage = {
        id: `msg_${Date.now()}`,
        type: 'ai',
        content: data.response || 'I apologize, but I\'m having trouble responding right now. Please try again.',
        timestamp: new Date(),
        role: 'assistant'
      };

      setMessages(prev => [...prev, aiResponse]);

      // Handle contact information and lead creation feedback
      if (data.contactInfo) {
        setContactInfo(data.contactInfo);
        if (data.contactInfo.email || data.contactInfo.phone || data.contactInfo.name) {
          setShowContactBadge(true);
        }
      }

      // Show success message if lead was created
      if (data.leadCreated) {
        toast.success('Thanks! We\'ve saved your contact information and will follow up soon.', {
          duration: 5000,
          position: 'top-right'
        });
      }

      // Note: Conversation saving is now handled by the edge function
      console.log('Message sent successfully, conversation saved on server');

    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => prev.filter(msg => !msg.isTyping));
      
      const errorMessage: ChatMessage = {
        id: `msg_${Date.now()}`,
        type: 'ai',
        content: 'I apologize, but I\'m experiencing technical difficulties. Please try again in a moment.',
        timestamp: new Date(),
        role: 'assistant'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleVoiceRecognition = () => {
    if (!recognition.current) {
      toast.error('Speech recognition not supported in this browser');
      return;
    }

    if (isListening) {
      recognition.current.stop();
      setIsListening(false);
    } else {
      recognition.current.start();
      setIsListening(true);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (isMinimized) {
    return (
      <div className="fixed top-6 right-6 z-50 animate-fade-in">
        <div className="relative">
          <Button
            onClick={onToggleMinimize}
            size="lg"
            className="rounded-full h-16 w-16 shadow-xl hover:shadow-2xl transition-all duration-300 bg-gradient-to-br from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 border-2 border-white/20 hover-scale group"
          >
            <MessageSquare className="h-7 w-7 transition-transform duration-300 group-hover:scale-110" />
          </Button>
          
          {/* Welcoming pulse indicator */}
          <div className="absolute -top-1 -right-1 h-4 w-4 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
          
          {/* Floating tooltip */}
          <div className="absolute -left-2 top-1/2 -translate-y-1/2 -translate-x-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            <div className="bg-white text-gray-800 px-3 py-2 rounded-lg shadow-lg text-sm font-medium whitespace-nowrap border">
              Chat with our AI Assistant
              <div className="absolute left-full top-1/2 -translate-y-1/2 border-4 border-transparent border-l-white"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed top-6 right-6 z-50 w-96 max-h-[calc(100vh-3rem)] flex flex-col animate-scale-in">
      <Card className="flex-1 flex flex-col shadow-2xl border-0 bg-white backdrop-blur-sm max-h-full overflow-hidden">
        <CardHeader className="flex-shrink-0 flex flex-row items-center justify-between space-y-0 p-4 bg-gradient-to-r from-primary/5 to-primary/10 border-b border-primary/10">
          <CardTitle className="flex items-center gap-3">
            <div className="relative">
              <Avatar className="h-10 w-10 ring-2 ring-primary/20 ring-offset-1">
                <AvatarImage src="/placeholder.svg" />
                <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-white font-bold text-lg">
                  🤖
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
            </div>
            <div>
              <p className="font-semibold text-gray-900 text-sm">{agentData?.name || 'AI Assistant'}</p>
              <p className="text-xs text-green-600 font-medium flex items-center gap-1">
                <div className="h-1.5 w-1.5 bg-green-500 rounded-full animate-pulse"></div>
                {showContactBadge ? 'Contact saved' : 'Ready to help'}
              </p>
            </div>
          </CardTitle>
          <div className="flex items-center gap-1">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onToggleMinimize}
              className="hover:bg-primary/10 rounded-full h-8 w-8 p-0 transition-colors"
            >
              <Minimize2 className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        
        {/* Messages Area - Scrollable */}
        <div className="flex-1 overflow-hidden flex flex-col min-h-0">
          <ScrollArea className="flex-1 px-4 py-2 max-h-[400px]">
            <div className="space-y-3 min-h-0">
              {messages.map((message, index) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 shadow-sm transition-all duration-200 ${
                      message.type === 'user'
                        ? 'bg-gradient-to-br from-primary to-primary/90 text-white rounded-br-md'
                        : 'bg-gray-50 border border-gray-100 text-gray-800 rounded-bl-md hover:bg-gray-100'
                    } ${message.isTyping ? 'animate-pulse' : ''}`}
                  >
                    <p className="text-sm leading-relaxed">{message.content}</p>
                    <p className={`text-xs mt-2 ${message.type === 'user' ? 'text-white/70' : 'text-gray-500'}`}>
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>
        </div>

        {/* Input Area - Fixed at Bottom */}
        <div className="flex-shrink-0 border-t border-gray-100 bg-white p-4">
          <div className="space-y-3">
            {/* Quick Suggestions */}
            <div className="flex flex-wrap gap-2">
              {welcomeSettings.quickActions.map((action, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => sendMessage(action)}
                  disabled={isLoading}
                  className="text-xs rounded-full bg-gray-50 hover:bg-primary/5 border-gray-200 hover:border-primary/30 transition-all"
                >
                  {action}
                </Button>
              ))}
            </div>

            {/* Input Row */}
            <div className="flex items-end space-x-2">
              <div className="flex-1">
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me anything about our services..."
                  disabled={isLoading}
                  className="border-gray-200 focus:border-primary focus:ring-primary/20 rounded-xl resize-none bg-gray-50 focus:bg-white transition-all"
                />
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={toggleVoiceRecognition}
                disabled={isLoading}
                className={`rounded-xl border-gray-200 p-2 transition-all duration-200 ${
                  isListening 
                    ? 'bg-red-500 border-red-500 text-white animate-pulse' 
                    : 'hover:border-primary hover:bg-primary/5'
                }`}
              >
                {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
              </Button>
              
              <Button
                onClick={() => sendMessage()}
                disabled={isLoading || !inputMessage.trim()}
                size="sm"
                className="rounded-xl bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 transition-all duration-200 hover-scale p-2"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>

            {/* Status Badge */}
            <div className="flex justify-center pt-1">
              <div className="flex gap-2">
                {showContactBadge && (
                  <Badge className="text-xs bg-green-100 text-green-700 border-green-200">
                    ✓ Contact Saved
                  </Badge>
                )}
                <Badge variant="outline" className="text-xs border-primary/20 text-primary/70 bg-primary/5">
                  🔒 Secure & Private • Powered by AI
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AiChatWidget;