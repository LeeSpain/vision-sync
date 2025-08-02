import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageSquare, Send, Mic, MicOff, X, Minimize2, Maximize2, Shield, Sparkles } from "lucide-react";
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
  embedded?: boolean;
}

const AiChatWidget: React.FC<AiChatWidgetProps> = ({ 
  isMinimized = true, 
  onToggleMinimize,
  embedded = false
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

        // Parse quick actions safely
        let parsedQuickActions = ["Tell me about AI solutions", "I need a custom app", "Show me investment opportunities", "I want to discuss pricing"];
        
        if (settingsMap.quick_actions) {
          if (Array.isArray(settingsMap.quick_actions)) {
            parsedQuickActions = settingsMap.quick_actions;
          } else if (typeof settingsMap.quick_actions === 'string') {
            try {
              // Clean the JSON string before parsing
              let cleanJson = settingsMap.quick_actions.trim();
              
              // Remove trailing commas before closing brackets
              cleanJson = cleanJson.replace(/,(\s*[\]}])/g, '$1');
              
              const parsed = JSON.parse(cleanJson);
              if (Array.isArray(parsed)) {
                parsedQuickActions = parsed.filter(action => action && action.trim()); // Remove empty actions
              }
            } catch (e) {
              console.error('Error parsing quick_actions:', e);
              // Try alternative parsing for malformed JSON
              try {
                // Extract text between quotes as fallback
                const matches = settingsMap.quick_actions.match(/"([^"]+)"/g);
                if (matches) {
                  parsedQuickActions = matches.map(match => match.replace(/"/g, ''));
                }
              } catch (fallbackError) {
                console.error('Fallback parsing also failed:', fallbackError);
              }
            }
          }
        }

        // Parse welcome message safely
        let welcomeMessage = "Hello! I'm here to help you discover amazing digital solutions. What kind of project are you looking for today?";
        if (settingsMap.welcome_message) {
          if (typeof settingsMap.welcome_message === 'string') {
            try {
              // Remove extra quotes and parse
              let cleanMessage = settingsMap.welcome_message.trim();
              // Remove outer quotes if present
              if (cleanMessage.startsWith('"') && cleanMessage.endsWith('"')) {
                cleanMessage = cleanMessage.slice(1, -1);
              }
              // Remove escaped quotes
              cleanMessage = cleanMessage.replace(/\\"/g, '"');
              welcomeMessage = cleanMessage;
            } catch (e) {
              console.error('Error parsing welcome_message:', e);
            }
          } else {
            welcomeMessage = settingsMap.welcome_message;
          }
        }

        setWelcomeSettings({
          message: welcomeMessage,
          quickActions: parsedQuickActions,
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

  // For embedded mode, don't show the minimized state
  if (embedded) {
    return (
      <div className="w-full h-full flex flex-col">
        <Card className="flex flex-col h-full shadow-lg border bg-white overflow-hidden">
          <CardHeader className="flex-shrink-0 flex flex-row items-center justify-between space-y-0 p-4 bg-gradient-to-r from-primary/5 to-primary/10 border-b border-primary/10">
            <CardTitle className="flex items-center gap-3">
              <div className="relative">
                <Shield className="h-6 w-6 text-primary" />
                <Sparkles className="h-3 w-3 absolute -top-1 -right-1 text-yellow-500 animate-pulse" />
              </div>
              <div>
                <div className="text-lg font-semibold text-gray-800">AI Guardian</div>
                <div className="text-sm text-gray-600 font-normal">Your AI Assistant</div>
              </div>
            </CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs bg-green-100 text-green-700 border-green-200">
                Online
              </Badge>
            </div>
          </CardHeader>
          
          <CardContent className="flex-1 p-0 flex flex-col min-h-0">
            <ScrollArea className="flex-1 px-4 pb-4">
              <div className="space-y-4 pt-8">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
                  >
                    <div className={`flex items-start gap-3 max-w-[85%] ${message.type === 'user' ? 'flex-row-reverse' : ''}`}>
                      <Avatar className={`h-8 w-8 flex-shrink-0 ${message.type === 'user' ? 'order-last' : ''}`}>
                        {message.type === 'user' ? (
                          <AvatarFallback className="bg-primary text-primary-foreground text-xs font-medium">
                            U
                          </AvatarFallback>
                        ) : (
                          <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/40 text-primary text-xs font-medium">
                            <Shield className="h-4 w-4" />
                          </AvatarFallback>
                        )}
                      </Avatar>
                      
                      <div className={`rounded-xl px-4 py-3 max-w-full break-words leading-relaxed ${
                        message.type === 'user' 
                          ? 'bg-primary text-primary-foreground shadow-md' 
                          : 'bg-gray-50 text-gray-800 border border-gray-100 shadow-sm'
                      }`}>
                        <div className="text-sm leading-6 whitespace-pre-wrap word-break">
                          {message.content}
                        </div>
                        <div className={`text-xs mt-2 opacity-70 ${
                          message.type === 'user' ? 'text-primary-foreground/70' : 'text-gray-500'
                        }`}>
                          {message.timestamp.toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {isLoading && (
                  <div className="flex justify-start animate-fade-in">
                    <div className="flex items-start gap-3 max-w-[85%]">
                      <Avatar className="h-8 w-8 flex-shrink-0">
                        <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/40 text-primary text-xs font-medium">
                          <Shield className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="bg-gray-50 rounded-xl px-4 py-3 border border-gray-100 shadow-sm">
                        <div className="flex items-center space-x-2">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          </div>
                          <span className="text-sm text-gray-500">AI Guardian is thinking...</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>
            
            {/* Quick Actions */}
            {welcomeSettings.quickActions && welcomeSettings.quickActions.length > 0 && messages.length === 1 && (
              <div className="p-4 border-t border-gray-100 bg-gray-50/50">
                <div className="text-xs font-medium text-gray-600 mb-2">Quick Actions:</div>
                <div className="flex flex-wrap gap-2">
                  {welcomeSettings.quickActions.map((action, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => sendMessage(action)}
                      className="text-xs bg-white hover:bg-gray-50 border-gray-200 text-gray-700 h-8"
                    >
                      {action}
                    </Button>
                  ))}
                </div>
              </div>
            )}
            
            {/* Input Area */}
            <div className="flex-shrink-0 p-4 border-t border-gray-100 bg-white">
              <div className="flex items-center gap-2">
                <Input
                  type="text"
                  placeholder="Ask AI Guardian anything..."
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={isLoading}
                  className="flex-1 border-gray-200 focus:border-primary/50 focus:ring-primary/20 bg-white"
                />
                <Button
                  onClick={toggleVoiceRecognition}
                  variant="outline"
                  size="sm"
                  disabled={isLoading}
                  className={`h-10 w-10 p-0 border-gray-200 ${
                    isListening 
                      ? 'bg-red-50 border-red-200 text-red-600 hover:bg-red-100' 
                      : 'hover:bg-gray-50'
                  }`}
                >
                  {isListening ? (
                    <MicOff className="h-4 w-4" />
                  ) : (
                    <Mic className="h-4 w-4" />
                  )}
                </Button>
                <Button
                  onClick={() => sendMessage()}
                  disabled={isLoading || !inputMessage.trim()}
                  size="sm"
                  className="h-10 w-10 p-0 bg-primary hover:bg-primary/90"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              
              {/* Status Badges */}
              <div className="flex justify-center gap-4 mt-3">
                <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                  🛡️ AI Security
                </Badge>
                <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                  📞 Contact Info Protected
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isMinimized) {
    return (
      <div className="fixed bottom-6 right-6 z-50 animate-fade-in">
        <div className="relative">
          <Button
            onClick={onToggleMinimize}
            size="lg"
            className="rounded-full h-16 w-auto px-6 shadow-xl hover:shadow-2xl transition-all duration-300 bg-gradient-to-br from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 border-2 border-white/20 hover-scale group relative overflow-hidden"
          >
            <div className="relative z-10 flex items-center justify-center gap-3">
              <div className="flex items-center justify-center relative">
                <Shield className="h-6 w-6 transition-transform duration-300 group-hover:scale-110" />
                <Sparkles className="h-3 w-3 absolute -top-1 -right-1 text-yellow-300 animate-pulse" />
              </div>
              <span className="text-white font-medium whitespace-nowrap">Talk To Us Now</span>
            </div>
          </Button>
          
          {/* Welcoming pulse indicator */}
          <div className="absolute -top-1 -right-1 h-4 w-4 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
          
          {/* AI Guardian Label */}
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            <div className="bg-gray-900 text-white px-2 py-1 rounded text-xs font-medium whitespace-nowrap">
              AI Guardian
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-80 sm:w-96 max-h-[min(85vh,600px)] h-[min(85vh,600px)] flex flex-col animate-scale-in">
      <Card className="flex flex-col h-full shadow-2xl border-0 bg-white backdrop-blur-sm overflow-hidden">
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
              <div className="font-semibold text-gray-900 text-sm">{agentData?.name || 'AI Assistant'}</div>
              <div className="text-xs text-green-600 font-medium flex items-center gap-1">
                <div className="h-1.5 w-1.5 bg-green-500 rounded-full animate-pulse"></div>
                {showContactBadge ? 'Contact saved' : 'Ready to help'}
              </div>
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
        
        {/* Messages Area - Properly constrained for scrolling */}
        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full">
            <div className="px-4 py-3 space-y-4">
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
                    <div className="text-sm leading-relaxed">{message.content}</div>
                    <div className={`text-xs mt-2 ${message.type === 'user' ? 'text-white/70' : 'text-gray-500'}`}>
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
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