import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageSquare, Send, Mic, MicOff, X, Minimize2, Maximize2, Sparkles, HeadphonesIcon, TrendingUp, Brain, User } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useLocation } from "react-router-dom";

interface ChatMessage {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  isTyping?: boolean;
  role?: 'user' | 'assistant';
  interactiveType?: 'quick_reply' | 'multiple_choice' | 'service_selector';
  options?: Array<{
    id: string;
    label: string;
    value: any;
    icon?: string;
    description?: string;
  }>;
  metadata?: {
    questionId?: string;
    category?: string;
    required?: boolean;
  };
  agentName?: string;
  agentType?: string;
}

interface CurrentAgent {
  id: string;
  name: string;
  type: string;
  avatar_url?: string;
}

interface AiChatWidgetProps {
  isMinimized?: boolean;
  onToggleMinimize?: () => void;
  embedded?: boolean;
}

// Agent configuration with avatars, colors, and icons
const AGENT_CONFIG = {
  support: {
    name: 'Alex',
    icon: HeadphonesIcon,
    bg: 'bg-blue-500',
    text: 'text-blue-600',
    badge: 'bg-blue-100 text-blue-700 border-blue-200',
    gradient: 'from-blue-500 to-blue-600',
    ring: 'ring-blue-300',
    dot: 'bg-blue-500',
    messageBg: 'bg-blue-50/50 border-blue-100',
    headerBg: 'from-blue-500/5 to-blue-600/10',
    label: 'Support'
  },
  sales: {
    name: 'Morgan',
    icon: TrendingUp,
    bg: 'bg-emerald-500',
    text: 'text-emerald-600',
    badge: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    gradient: 'from-emerald-500 to-teal-600',
    ring: 'ring-emerald-300',
    dot: 'bg-emerald-500',
    messageBg: 'bg-emerald-50/50 border-emerald-100',
    headerBg: 'from-emerald-500/5 to-teal-600/10',
    label: 'Sales'
  },
  brain: {
    name: 'Nexus',
    icon: Brain,
    bg: 'bg-purple-500',
    text: 'text-purple-600',
    badge: 'bg-purple-100 text-purple-700 border-purple-200',
    gradient: 'from-purple-500 to-indigo-600',
    ring: 'ring-purple-300',
    dot: 'bg-purple-500',
    messageBg: 'bg-purple-50/50 border-purple-100',
    headerBg: 'from-purple-500/5 to-indigo-600/10',
    label: 'AI Brain'
  },
  general: {
    name: 'Assistant',
    icon: Sparkles,
    bg: 'bg-royal-purple',
    text: 'text-royal-purple',
    badge: 'bg-royal-purple/10 text-royal-purple border-royal-purple/20',
    gradient: 'from-royal-purple to-electric-blue',
    ring: 'ring-royal-purple/30',
    dot: 'bg-emerald-500',
    messageBg: 'bg-gray-50 border-gray-100',
    headerBg: 'from-midnight-navy/5 to-royal-purple/10',
    label: 'AI'
  },
};

type AgentType = keyof typeof AGENT_CONFIG;

const AiChatWidget: React.FC<AiChatWidgetProps> = ({ 
  isMinimized = true, 
  onToggleMinimize,
  embedded = false
}) => {
  const location = useLocation();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [sessionId] = useState(() => `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
  const [currentAgent, setCurrentAgent] = useState<CurrentAgent>({ id: '', name: '', type: 'general' });
  const [contactInfo, setContactInfo] = useState<any>({});
  const [showContactBadge, setShowContactBadge] = useState(false);
  const [isEscalated, setIsEscalated] = useState(false);
  const [handoffMessage, setHandoffMessage] = useState<string | null>(null);
  const [isHandingOff, setIsHandingOff] = useState(false);
  const [previousAgent, setPreviousAgent] = useState<CurrentAgent | null>(null);
  const [welcomeSettings, setWelcomeSettings] = useState({
    message: "Hi there! I'm here to help you find the perfect digital solution for your needs. What can I help you with today?",
    quickActions: ["I need a custom app built", "Tell me about your AI solutions", "I'm interested in investing", "Let's discuss my project"],
    delay: 1000
  });
  
  // Get agent configuration
  const agentType = (currentAgent.type as AgentType) || 'general';
  const agentConfig = AGENT_CONFIG[agentType] || AGENT_CONFIG.general;
  const agentName = currentAgent.name || agentConfig.name;
  const AgentIcon = agentConfig.icon;
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
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
    // Only scroll after a short delay to prevent interference with page scroll
    const timer = setTimeout(() => {
      scrollToBottom();
    }, 100);
    return () => clearTimeout(timer);
  }, [messages]);

  const loadAgentData = async () => {
    try {
      // Load the default/first active agent for initial display
      const { data } = await supabase
        .from('ai_agents')
        .select('*')
        .eq('is_active', true)
        .eq('agent_type', 'sales')
        .maybeSingle();
      
      if (data) {
        setCurrentAgent({
          id: data.id,
          name: data.name,
          type: data.agent_type || 'general',
          avatar_url: data.avatar_url
        });
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
    // Scroll within the chat container only, prevent page scrolling
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  };

  const sendMessage = async (content: string = inputMessage, metadata?: any) => {
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
        content: msg.content
      }));

      // Detect page context from current URL
      const pageContext = location.pathname.replace('/', '') || 'home';

      // Call AI router endpoint
      const { data, error } = await supabase.functions.invoke('ai-router', {
        body: {
          message: content,
          sessionId,
          conversationHistory,
          isAdmin: false,
          pageContext,
          currentAgentId: currentAgent.id || null
        }
      });

      // Remove typing indicator
      setMessages(prev => prev.filter(msg => !msg.isTyping));

      if (error) {
        console.error('AI Router Error:', error);
        throw error;
      }

      console.log('AI Router Response:', {
        agent: data.agent,
        handoff: data.handoff,
        intent: data.analysis?.intent,
        sentiment: data.analysis?.sentiment,
        hasLead: !!data.lead
      });

      // Update current agent if changed
      if (data.agent) {
        const newAgentType = data.agent.type as AgentType;
        const newAgentConfig = AGENT_CONFIG[newAgentType] || AGENT_CONFIG.general;
        
        // Handle handoff animation if agent changed
        if (data.handoff?.occurred && currentAgent.id !== data.agent.id) {
          setPreviousAgent(currentAgent);
          setIsHandingOff(true);
          setHandoffMessage(`Connecting you with ${data.agent.name} (${newAgentConfig.label})...`);
          
          // Animate transition
          setTimeout(() => {
            setCurrentAgent({
              id: data.agent.id,
              name: data.agent.name,
              type: data.agent.type,
              avatar_url: data.agent.avatar_url
            });
            setIsHandingOff(false);
          }, 800);
          
          setTimeout(() => {
            setHandoffMessage(null);
            setPreviousAgent(null);
          }, 3000);
        } else {
          setCurrentAgent({
            id: data.agent.id,
            name: data.agent.name,
            type: data.agent.type,
            avatar_url: data.agent.avatar_url
          });
        }
      }

      // Handle escalation
      if (data.analysis?.escalationRequested) {
        setIsEscalated(true);
        toast.info("Thanks! Someone from our team will reach out to you shortly.", {
          duration: 5000,
          position: 'top-right'
        });
      }

      const aiResponse: ChatMessage = {
        id: `msg_${Date.now()}`,
        type: 'ai',
        content: data.response || 'I apologize, but I\'m having trouble responding right now. Please try again.',
        timestamp: new Date(),
        role: 'assistant',
        agentName: data.agent?.name,
        agentType: data.agent?.type
      };

      setMessages(prev => [...prev, aiResponse]);

      // Handle contact information and lead creation feedback
      if (data.analysis?.hasContactInfo) {
        setContactInfo(data.analysis.contactInfo);
        setShowContactBadge(true);
      }

      // Show success message if lead was created
      if (data.lead) {
        console.log('✅ Lead created:', data.lead);
        toast.success('Thanks! We\'ve saved your contact information and will follow up soon.', {
          duration: 5000,
          position: 'top-right'
        });
      }

      console.log('Message routed successfully via multi-agent system');

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
      window.dispatchEvent(new CustomEvent('ai-chat-end'));
    } else {
      recognition.current.start();
      setIsListening(true);
      window.dispatchEvent(new CustomEvent('ai-chat-start'));
    }
  };

  const handleQuickReply = async (option: any, messageId: string) => {
    // Disable the options once selected
    setMessages(prev => prev.map(msg => 
      msg.id === messageId 
        ? { ...msg, options: undefined, interactiveType: undefined }
        : msg
    ));
    
    // Continue conversation with selected value
    await sendMessage(option.label, { selectedOption: option });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Helper to get agent type icon component
  const getAgentIcon = (type: string, className: string = "h-3 w-3") => {
    const config = AGENT_CONFIG[type as AgentType] || AGENT_CONFIG.general;
    const Icon = config.icon;
    return <Icon className={className} />;
  };

  // Helper to get agent role label
  const getAgentRoleLabel = (type: string) => {
    switch (type) {
      case 'support': return 'Support Specialist';
      case 'sales': return 'Sales Advisor';
      case 'brain': return 'AI Orchestrator';
      default: return 'Your Advisor';
    }
  };

  // Helper to get message agent config
  const getMessageAgentConfig = (message: ChatMessage) => {
    const msgType = (message.agentType as AgentType) || agentType;
    return AGENT_CONFIG[msgType] || AGENT_CONFIG.general;
  };

  // Render handoff bubble
  const renderHandoffBubble = () => {
    if (!handoffMessage) return null;
    const targetConfig = AGENT_CONFIG[agentType] || AGENT_CONFIG.general;
    const TargetIcon = targetConfig.icon;
    
    return (
      <div className="flex justify-center my-4 animate-fade-in">
        <div className={`flex items-center gap-3 px-4 py-3 rounded-full bg-gradient-to-r ${targetConfig.headerBg} border ${targetConfig.badge.split(' ')[2]} shadow-sm`}>
          <div className="relative">
            {isHandingOff && previousAgent && (
              <div className="absolute inset-0 animate-ping">
                <div className={`h-8 w-8 rounded-full bg-gradient-to-br ${AGENT_CONFIG[(previousAgent.type as AgentType) || 'general'].gradient} opacity-50`} />
              </div>
            )}
            <div className={`h-8 w-8 rounded-full bg-gradient-to-br ${targetConfig.gradient} flex items-center justify-center text-white transition-transform duration-500 ${isHandingOff ? 'scale-110' : 'scale-100'}`}>
              <TargetIcon className="h-4 w-4" />
            </div>
          </div>
          <span className={`text-sm font-medium ${targetConfig.text}`}>
            {handoffMessage}
          </span>
          <div className="flex space-x-1">
            <div className={`w-1.5 h-1.5 ${targetConfig.dot} rounded-full animate-bounce`} style={{ animationDelay: '0s' }} />
            <div className={`w-1.5 h-1.5 ${targetConfig.dot} rounded-full animate-bounce`} style={{ animationDelay: '0.1s' }} />
            <div className={`w-1.5 h-1.5 ${targetConfig.dot} rounded-full animate-bounce`} style={{ animationDelay: '0.2s' }} />
          </div>
        </div>
      </div>
    );
  };

  // For embedded mode, don't show the minimized state
  if (embedded) {
    return (
      <div className="w-full h-full flex flex-col min-h-0">
        <Card className="flex flex-col h-full shadow-lg border bg-white overflow-hidden">
          <CardHeader className={`flex-shrink-0 flex flex-row items-center justify-between space-y-0 p-4 bg-gradient-to-r ${agentConfig.headerBg} border-b border-gray-100`}>
            <CardTitle className="flex items-center gap-3">
              <div className={`relative transition-all duration-500 ${isHandingOff ? 'scale-95 opacity-70' : 'scale-100 opacity-100'}`}>
                <div className={`h-10 w-10 rounded-full bg-gradient-to-br ${agentConfig.gradient} flex items-center justify-center text-white ring-2 ring-offset-1 ${agentConfig.ring}`}>
                  <AgentIcon className="h-5 w-5" />
                </div>
                <div className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 ${agentConfig.dot} rounded-full border-2 border-white animate-pulse`}></div>
              </div>
              <div>
                <div className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  {agentName}
                  <Badge className={`text-xs ${agentConfig.badge}`}>
                    {agentConfig.label}
                  </Badge>
                </div>
                <div className="text-sm text-gray-600 font-normal">{getAgentRoleLabel(agentType)}</div>
              </div>
            </CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs bg-green-100 text-green-700 border-green-200">
                Online
              </Badge>
            </div>
          </CardHeader>
          
          <CardContent className="flex-1 p-0 flex flex-col overflow-hidden min-h-0">
            <ScrollArea ref={scrollAreaRef} className="flex-1 overflow-y-auto px-4">
              <div className="space-y-4 py-4">
                {/* Handoff notification bubble */}
                {renderHandoffBubble()}
                
                {messages.map((message, index) => {
                  const msgConfig = message.type === 'ai' ? getMessageAgentConfig(message) : null;
                  const MsgIcon = msgConfig?.icon || AgentIcon;
                  
                  return (
                    <div
                      key={index}
                      className={`flex flex-col ${message.type === 'user' ? 'items-end' : 'items-start'} animate-fade-in`}
                    >
                      <div className={`flex items-start gap-3 max-w-[85%] ${message.type === 'user' ? 'flex-row-reverse' : ''}`}>
                        {/* Avatar */}
                        {message.type === 'user' ? (
                          <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white flex-shrink-0">
                            <User className="h-4 w-4" />
                          </div>
                        ) : (
                          <div className="relative flex-shrink-0">
                            <div className={`h-8 w-8 rounded-full bg-gradient-to-br ${msgConfig?.gradient || agentConfig.gradient} flex items-center justify-center text-white`}>
                              <MsgIcon className="h-4 w-4" />
                            </div>
                          </div>
                        )}
                        
                        {/* Message bubble */}
                        <div className={`rounded-xl px-4 py-3 max-w-full break-words leading-relaxed ${
                          message.type === 'user' 
                            ? 'bg-primary text-primary-foreground shadow-md' 
                            : `${msgConfig?.messageBg || 'bg-gray-50 border-gray-100'} text-gray-800 border shadow-sm`
                        }`}>
                          <div className="text-sm leading-6 whitespace-pre-wrap">
                            {message.content.replace(/\*\*(.*?)\*\*/g, '$1').replace(/__(.*?)__/g, '$1')}
                          </div>
                          <div className={`text-xs mt-2 opacity-70 flex items-center gap-2 ${
                            message.type === 'user' ? 'text-primary-foreground/70' : 'text-gray-500'
                          }`}>
                            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            {message.type === 'ai' && message.agentName && (
                              <span className={`text-xs ${msgConfig?.text || 'text-gray-400'}`}>
                                • {message.agentName}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      {/* Interactive Components */}
                      {message.type === 'ai' && message.interactiveType && message.options && (
                        <div className="w-full pl-11 pr-4 mt-3">
                          {message.interactiveType === 'quick_reply' && (
                            <div className="flex flex-wrap gap-2">
                              {message.options.map((option: any) => (
                                <Button
                                  key={option.id}
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleQuickReply(option, message.id)}
                                  className="hover:bg-primary hover:text-white transition-colors"
                                >
                                  {option.icon && <span className="mr-1">{option.icon}</span>}
                                  {option.label}
                                </Button>
                              ))}
                            </div>
                          )}
                          
                          {message.interactiveType === 'service_selector' && (
                            <div className="grid grid-cols-1 gap-3">
                              {message.options.map((option: any) => (
                                <Card
                                  key={option.id}
                                  className="cursor-pointer hover:shadow-md hover:border-primary transition-all p-4 bg-white"
                                  onClick={() => handleQuickReply(option, message.id)}
                                >
                                  <div className="flex items-start gap-3">
                                    <div className="text-2xl flex-shrink-0">{option.icon}</div>
                                    <div className="flex-1 min-w-0">
                                      <div className="font-semibold text-base mb-1">{option.label}</div>
                                      <div className="text-sm text-gray-600">{option.description}</div>
                                    </div>
                                  </div>
                                </Card>
                              ))}
                            </div>
                          )}
                          
                          {message.interactiveType === 'multiple_choice' && (
                            <div className="space-y-2">
                              {message.options.map((option: any) => (
                                <Button
                                  key={option.id}
                                  variant="outline"
                                  className="w-full justify-start hover:bg-primary/10 text-left h-auto py-3 px-4"
                                  onClick={() => handleQuickReply(option, message.id)}
                                >
                                  <div className="flex items-center gap-3 w-full">
                                    {option.icon && <span className="text-lg">{option.icon}</span>}
                                    <div className="flex-1 min-w-0">
                                      <span className="font-semibold text-sm block">{option.label}</span>
                                      {option.description && (
                                        <span className="text-xs text-gray-500 block mt-1">{option.description}</span>
                                      )}
                                    </div>
                                  </div>
                                </Button>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
                
                {isLoading && (
                  <div className="flex justify-start animate-fade-in">
                    <div className="flex items-start gap-3 max-w-[85%]">
                      <div className={`h-8 w-8 rounded-full bg-gradient-to-br ${agentConfig.gradient} flex items-center justify-center text-white flex-shrink-0`}>
                        <AgentIcon className="h-4 w-4" />
                      </div>
                      <div className={`${agentConfig.messageBg} rounded-xl px-4 py-3 border shadow-sm`}>
                        <div className="flex items-center space-x-2">
                          <div className="flex space-x-1">
                            <div className={`w-2 h-2 ${agentConfig.dot} rounded-full animate-bounce`}></div>
                            <div className={`w-2 h-2 ${agentConfig.dot} rounded-full animate-bounce`} style={{ animationDelay: '0.1s' }}></div>
                            <div className={`w-2 h-2 ${agentConfig.dot} rounded-full animate-bounce`} style={{ animationDelay: '0.2s' }}></div>
                          </div>
                          <span className="text-sm text-gray-500">{agentName} is typing...</span>
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
              <div className="flex-shrink-0 p-4 border-t border-gray-100 bg-gray-50/50">
                <div className="text-xs font-medium text-gray-600 mb-2">Quick Actions:</div>
                <div className="flex flex-wrap gap-2">
                  {welcomeSettings.quickActions.map((action, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        window.dispatchEvent(new CustomEvent('ai-chat-start'));
                        sendMessage(action);
                      }}
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
                  placeholder={`Ask ${agentName} anything...`}
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
                <Badge variant="outline" className={`text-xs ${agentConfig.badge}`}>
                  💬 {agentConfig.label} Chat
                </Badge>
                <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                  🔒 Secure & Private
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isMinimized) {
    const hasConversation = messages.length > 1;
    const buttonText = hasConversation ? `Chat with ${agentName}` : 'Chat with us';
    
    return (
      <div className="fixed top-20 right-4 z-40 animate-fade-in">
        <div className="relative group">
          <Button
            onClick={onToggleMinimize}
            size="lg"
            className={`rounded-full h-14 w-auto px-5 shadow-xl hover:shadow-2xl transition-all duration-300 bg-gradient-to-br ${agentConfig.gradient} hover:opacity-90 border-2 border-white/20 hover-scale relative overflow-hidden`}
          >
            <div className="relative z-10 flex items-center justify-center gap-3">
              <div className="relative">
                {currentAgent.avatar_url ? (
                  <Avatar className="h-8 w-8 ring-2 ring-white/30">
                    <AvatarImage src={currentAgent.avatar_url} alt={agentName} className="object-cover" />
                    <AvatarFallback className="bg-white/20">
                      <AgentIcon className="h-4 w-4 text-white" />
                    </AvatarFallback>
                  </Avatar>
                ) : (
                  <div className={`h-8 w-8 rounded-full bg-white/20 flex items-center justify-center`}>
                    <AgentIcon className="h-4 w-4 text-white" />
                  </div>
                )}
                {/* Online indicator */}
                <div className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 ${agentConfig.dot} rounded-full border-2 border-white animate-pulse`}></div>
              </div>
              <span className="text-white font-medium whitespace-nowrap">{buttonText}</span>
            </div>
          </Button>
          
          {/* Tooltip */}
          <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            <div className="bg-gray-900 text-white px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap shadow-lg">
              I'm here to help! 💬
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed top-20 right-4 z-40 w-80 sm:w-96 max-h-[min(70vh,550px)] h-[min(70vh,550px)] flex flex-col animate-scale-in">
      <Card className="flex flex-col h-full shadow-2xl border-0 bg-white backdrop-blur-sm overflow-hidden">
        <CardHeader className={`flex-shrink-0 flex flex-row items-center justify-between space-y-0 p-4 bg-gradient-to-r ${agentConfig.headerBg} border-b border-gray-100`}>
          <CardTitle className="flex items-center gap-3">
            <div className={`relative transition-all duration-500 ${isHandingOff ? 'scale-95 opacity-70' : 'scale-100 opacity-100'}`}>
              {currentAgent.avatar_url ? (
                <Avatar className={`h-10 w-10 ring-2 ring-offset-1 ${agentConfig.ring}`}>
                  <AvatarImage src={currentAgent.avatar_url} alt={agentName} className="object-cover" />
                  <AvatarFallback className={`bg-gradient-to-br ${agentConfig.gradient} text-white`}>
                    <AgentIcon className="h-5 w-5" />
                  </AvatarFallback>
                </Avatar>
              ) : (
                <div className={`h-10 w-10 rounded-full bg-gradient-to-br ${agentConfig.gradient} flex items-center justify-center text-white ring-2 ring-offset-1 ${agentConfig.ring}`}>
                  <AgentIcon className="h-5 w-5" />
                </div>
              )}
              <div className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 ${agentConfig.dot} rounded-full border-2 border-white animate-pulse`}></div>
            </div>
            <div>
              <div className="font-semibold text-gray-900 text-sm flex items-center gap-2">
                {agentName}
                {currentAgent.type && currentAgent.type !== 'general' && (
                  <Badge className={`text-xs px-1.5 py-0 flex items-center gap-1 ${agentConfig.badge}`}>
                    {getAgentIcon(agentType, "h-3 w-3")}
                    <span>{agentConfig.label}</span>
                  </Badge>
                )}
              </div>
              <div className={`text-xs font-medium flex items-center gap-1 ${agentConfig.text}`}>
                <div className={`h-1.5 w-1.5 rounded-full animate-pulse ${agentConfig.dot}`}></div>
                {isEscalated ? 'Human follow-up scheduled' : showContactBadge ? 'Contact saved' : 'Available now'}
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
        
        {/* Handoff notification */}
        {handoffMessage && (
          <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 text-sm text-amber-700 flex items-center gap-2 animate-fade-in">
            <Sparkles className="h-4 w-4" />
            {handoffMessage}
          </div>
        )}
        
        {/* Messages Area - Properly constrained for scrolling */}
        <div className="flex-1 overflow-hidden">
          <ScrollArea ref={scrollAreaRef} className="h-full">
            <div className="px-4 py-3 space-y-4">
              {messages.map((message, index) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  {message.type === 'ai' && (
                    <div className="flex-shrink-0 mr-2 mt-1">
                      {currentAgent.avatar_url ? (
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={currentAgent.avatar_url} alt={agentName} className="object-cover" />
                          <AvatarFallback className={`bg-gradient-to-br ${agentConfig.gradient} text-white text-xs`}>
                            <AgentIcon className="h-3 w-3" />
                          </AvatarFallback>
                        </Avatar>
                      ) : (
                        <div className={`h-6 w-6 rounded-full bg-gradient-to-br ${agentConfig.gradient} flex items-center justify-center text-white`}>
                          <AgentIcon className="h-3 w-3" />
                        </div>
                      )}
                    </div>
                  )}
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
                  placeholder={`Ask ${agentName} anything...`}
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
                <Badge variant="outline" className={`text-xs ${agentConfig.badge}`}>
                  🔒 Secure Chat with {agentName}
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