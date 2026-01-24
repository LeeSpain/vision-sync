import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MessageCircle, HeadphonesIcon, TrendingUp, Brain, Sparkles } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

// Agent configuration - matches AiChatWidget exactly
const AGENT_CONFIG = {
  support: {
    icon: HeadphonesIcon,
    gradient: 'from-blue-500 to-blue-600',
    dot: 'bg-blue-500',
  },
  sales: {
    icon: TrendingUp,
    gradient: 'from-emerald-500 to-teal-600',
    dot: 'bg-emerald-500',
  },
  brain: {
    icon: Brain,
    gradient: 'from-purple-500 to-indigo-600',
    dot: 'bg-purple-500',
  },
  general: {
    icon: Sparkles,
    gradient: 'from-royal-purple to-electric-blue',
    dot: 'bg-emerald-500',
  },
};

type AgentType = keyof typeof AGENT_CONFIG;

interface HeaderChatButtonProps {
  onClick: () => void;
}

const HeaderChatButton = ({ onClick }: HeaderChatButtonProps) => {
  const [currentAgent, setCurrentAgent] = useState<{
    name: string;
    type: string;
    avatar_url?: string;
  }>({ name: 'Paul', type: 'general' });

  // Fetch sales agent on mount (matches original AiChatWidget behavior)
  useEffect(() => {
    const fetchActiveAgent = async () => {
      try {
        const { data: agent } = await supabase
          .from('ai_agents')
          .select('id, name, agent_type, avatar_url')
          .eq('is_active', true)
          .eq('agent_type', 'sales')
          .maybeSingle();

        if (agent) {
          setCurrentAgent({
            name: agent.name || 'Paul',
            type: agent.agent_type || 'sales',
            avatar_url: agent.avatar_url || undefined,
          });
        }
      } catch (error) {
        console.error('Failed to fetch agent:', error);
      }
    };

    fetchActiveAgent();
  }, []);

  const agentType = (currentAgent.type || 'general') as AgentType;
  const agentConfig = AGENT_CONFIG[agentType] || AGENT_CONFIG.general;
  const agentName = currentAgent.name || 'Paul';
  const AgentIcon = agentConfig.icon;
  
  const buttonText = 'Chat with us';

  return (
    <div className="relative group">
      <Button
        onClick={onClick}
        size="lg"
        className={`rounded-full h-10 sm:h-12 w-auto px-3 sm:px-4 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br ${agentConfig.gradient} hover:opacity-90 border-2 border-white/20 hover-scale relative overflow-hidden`}
      >
        <div className="relative z-10 flex items-center justify-center gap-2 sm:gap-3">
          <div className="relative">
            {currentAgent.avatar_url ? (
              <Avatar className="h-6 w-6 sm:h-7 sm:w-7 ring-2 ring-white/30">
                <AvatarImage src={currentAgent.avatar_url} alt={agentName} className="object-cover" />
                <AvatarFallback className="bg-white/20">
                  <AgentIcon className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                </AvatarFallback>
              </Avatar>
            ) : (
              <div className="h-6 w-6 sm:h-7 sm:w-7 rounded-full bg-white/20 flex items-center justify-center">
                <AgentIcon className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
              </div>
            )}
            {/* Online indicator */}
            <div className={`absolute -bottom-0.5 -right-0.5 h-2 w-2 sm:h-2.5 sm:w-2.5 ${agentConfig.dot} rounded-full border-2 border-white animate-pulse`}></div>
          </div>
          <span className="text-white font-medium whitespace-nowrap text-xs sm:text-sm">{buttonText}</span>
        </div>
      </Button>
      
      {/* Tooltip */}
      <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        <div className="bg-gray-900 text-white px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap shadow-lg">
          I'm here to help! 💬
        </div>
      </div>
    </div>
  );
};

export default HeaderChatButton;
