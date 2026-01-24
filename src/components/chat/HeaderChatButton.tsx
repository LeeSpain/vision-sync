import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MessageCircle, HeadphonesIcon, TrendingUp, Brain } from 'lucide-react';

interface AgentConfig {
  gradient: string;
  dot: string;
}

interface CurrentAgent {
  avatar_url?: string;
  name?: string;
  type?: string;
}

interface HeaderChatButtonProps {
  onClick: () => void;
  currentAgent?: CurrentAgent;
  hasConversation?: boolean;
}

const AGENT_CONFIG: Record<string, AgentConfig> = {
  support: {
    gradient: 'from-blue-500 to-blue-600',
    dot: 'bg-blue-400',
  },
  sales: {
    gradient: 'from-emerald-500 to-emerald-600',
    dot: 'bg-emerald-400',
  },
  brain: {
    gradient: 'from-purple-500 to-purple-600',
    dot: 'bg-purple-400',
  },
  general: {
    gradient: 'from-royal-purple to-electric-blue',
    dot: 'bg-electric-blue',
  },
};

const getAgentIcon = (type: string) => {
  switch (type) {
    case 'support':
      return HeadphonesIcon;
    case 'sales':
      return TrendingUp;
    case 'brain':
      return Brain;
    default:
      return MessageCircle;
  }
};

const HeaderChatButton = ({ 
  onClick, 
  currentAgent = { name: 'Paul', type: 'general' },
  hasConversation = false 
}: HeaderChatButtonProps) => {
  const agentType = (currentAgent?.type || 'general') as keyof typeof AGENT_CONFIG;
  const agentConfig = AGENT_CONFIG[agentType] || AGENT_CONFIG.general;
  const agentName = currentAgent?.name || 'Paul';
  const AgentIcon = getAgentIcon(agentType);
  
  const buttonText = hasConversation ? `Chat with ${agentName}` : 'Chat with us';

  return (
    <div className="relative group">
      <Button
        onClick={onClick}
        size="lg"
        className={`rounded-full h-10 sm:h-12 w-auto px-3 sm:px-4 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br ${agentConfig.gradient} hover:opacity-90 border-2 border-white/20 hover-scale relative overflow-hidden`}
      >
        <div className="relative z-10 flex items-center justify-center gap-2 sm:gap-3">
          <div className="relative">
            {currentAgent?.avatar_url ? (
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
