import { useState, useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import {
  LayoutDashboard,
  FolderOpen,
  Users,
  FileText,
  Settings,
  Plus,
  BarChart3,
  Mail,
  TrendingUp,
  Brain,
  MessageCircle,
  Building2,
  Bug,
  ArrowRightLeft,
  Bot,
  ChevronDown,
  Sparkles
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { Badge } from "@/components/ui/badge"
import { projectManager } from "@/utils/projectManager"
import { supabaseLeadManager } from "@/utils/supabaseLeadManager"
import { supabase } from "@/integrations/supabase/client"
import { useTranslation } from "react-i18next";

const mainItems = [
  { key: "admin.dashboard", url: "#overview", icon: LayoutDashboard },
  { key: "admin.plans", url: "#plans", icon: FileText },
  { key: "admin.modules", url: "#modules", icon: FolderOpen },
  { key: "admin.solutions", url: "#solutions", icon: Building2 },
  { key: "admin.pageSections", url: "#page-sections", icon: LayoutDashboard },
  { key: "admin.messages", url: "#messages", icon: Mail },
  { key: "admin.conversations", url: "#conversations", icon: MessageCircle },
  { key: "admin.leads", url: "#leads", icon: Users },
  { key: "admin.salesPipeline", url: "#sales-pipeline", icon: TrendingUp },
  { key: "admin.analytics", url: "#analytics", icon: BarChart3 },
]

const aiAgentItems = [
  { key: "admin.agentManager", url: "#ai-agent", icon: Brain, badge: null, theme: null },
  { key: "admin.brainCommand", url: "#brain-command", icon: Sparkles, badge: "Nexus", theme: "purple" },
  { key: "admin.agentTesting", url: "#agent-testing", icon: Bug, badge: "Debug", theme: "amber" },
  { key: "admin.routingRules", url: "#routing-rules", icon: ArrowRightLeft, badge: "Config", theme: "cyan" },
]

// Quick actions removed - "Add Project" now navigates to projects section

export function AdminSidebar() {
  const { state } = useSidebar()
  const collapsed = state === "collapsed"
  const location = useLocation()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const navigate = useNavigate()
  const hash = location.hash || "#overview"

  const [aiSectionExpanded, setAiSectionExpanded] = useState(true)

  const [projectStats, setProjectStats] = useState({
    totalProjects: 0,
    activeProjects: 0
  });

  const [leadStats, setLeadStats] = useState({
    totalLeads: 0
  });

  const [conversationStats, setConversationStats] = useState({
    totalConversations: 0
  });

  // Auto-expand when AI route is active
  useEffect(() => {
    const aiRoutes = ['#ai-agent', '#brain-command', '#agent-testing', '#routing-rules'];
    if (aiRoutes.includes(hash)) {
      setAiSectionExpanded(true);
    }
  }, [hash]);

  useEffect(() => {
    loadProjectStats();
    loadLeadStats();
    loadConversationStats();
  }, []);

  const loadProjectStats = async () => {
    try {
      const stats = await projectManager.getProjectStats();
      const activeCount = stats.publicProjects || 0;

      setProjectStats({
        totalProjects: stats.totalProjects,
        activeProjects: activeCount
      });
    } catch (error) {
      console.error('Error loading project stats:', error);
    }
  };

  const loadLeadStats = async () => {
    try {
      // Use server-side count instead of downloading all leads
      const { count, error } = await supabase
        .from('leads')
        .select('id', { count: 'exact', head: true })
        .neq('status', 'archived');

      if (error) throw error;

      setLeadStats({
        totalLeads: count || 0
      });
    } catch (error) {
      console.error('Error loading lead stats:', error);
    }
  };

  const loadConversationStats = async () => {
    try {
      // Use server-side count instead of downloading all records
      const { count, error } = await supabase
        .from('ai_conversations')
        .select('id', { count: 'exact', head: true });

      if (error) throw error;

      setConversationStats({
        totalConversations: count || 0
      });
    } catch (error) {
      console.error('Error loading conversation stats:', error);
    }
  };

  const isActive = (path: string) => hash === path

  const handleNavigation = (section: string) => {
    const newHash = section.replace('#', '');
    navigate(`/admin#${newHash}`)
  }

  return (
    <Sidebar
      className={collapsed ? "w-14" : "w-64"}
      collapsible="icon"
    >
      <SidebarContent className="bg-midnight-navy text-slate-white">
        {/* Header */}
        <div className="p-4 border-b border-slate-white/10">
          {!collapsed && (
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">V</span>
              </div>
              <div>
                <h2 className="font-heading font-bold">Vision-Sync</h2>
                <p className="text-xs text-slate-white/60">{t('admin.adminPanel')}</p>
              </div>
            </div>
          )}
          {collapsed && (
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center mx-auto">
              <span className="text-white font-bold text-lg">V</span>
            </div>
          )}
        </div>

        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-slate-white/60">
            {!collapsed && t('admin.mainMenu')}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.key}>
                  <SidebarMenuButton asChild>
                    <button
                      onClick={() => handleNavigation(item.url)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${isActive(item.url)
                        ? "bg-royal-purple text-white"
                        : "text-slate-white/80 hover:bg-slate-white/10 hover:text-white"
                        }`}
                    >
                      <div className="flex items-center space-x-3">
                        <item.icon className="h-5 w-5" />
                        {!collapsed && <span>{t(item.key)}</span>}
                      </div>
                      {!collapsed && item.key === "admin.projects" && (
                        <Badge variant="secondary" className="bg-royal-purple/20 text-royal-purple border-0">
                          {projectStats.totalProjects}
                        </Badge>
                      )}
                      {!collapsed && item.key === "admin.leads" && (
                        <Badge variant="secondary" className="bg-emerald-green/20 text-emerald-green border-0">
                          {leadStats.totalLeads}
                        </Badge>
                      )}
                      {!collapsed && item.key === "admin.conversations" && (
                        <Badge variant="secondary" className="bg-electric-blue/20 text-electric-blue border-0">
                          {conversationStats.totalConversations}
                        </Badge>
                      )}
                    </button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}

              {/* AI Agents Collapsible Section */}
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <button
                    onClick={() => setAiSectionExpanded(!aiSectionExpanded)}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-gradient-to-r from-purple-500/10 to-indigo-500/10 text-purple-300 hover:from-purple-500/20 hover:to-indigo-500/20 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <Bot className="h-5 w-5 text-purple-400" />
                      {!collapsed && <span className="font-medium">{t('admin.aiAgents')}</span>}
                    </div>
                    {!collapsed && (
                      <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${aiSectionExpanded ? 'rotate-180' : ''}`} />
                    )}
                  </button>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* AI Sub-items - only show when expanded and not collapsed sidebar */}
              {aiSectionExpanded && !collapsed && (
                <div className="ml-4 space-y-1 mt-1 border-l border-purple-500/20 pl-2">
                  {aiAgentItems.map((item) => (
                    <SidebarMenuItem key={item.key}>
                      <SidebarMenuButton asChild>
                        <button
                          onClick={() => handleNavigation(item.url)}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${isActive(item.url)
                            ? item.theme === 'purple'
                              ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white'
                              : item.theme === 'amber'
                                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white'
                                : item.theme === 'cyan'
                                  ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white'
                                  : 'bg-royal-purple text-white'
                            : 'text-slate-white/70 hover:bg-slate-white/10 hover:text-white'
                            }`}
                        >
                          <div className="flex items-center space-x-3">
                            <item.icon className={`h-4 w-4 ${item.theme === 'purple' ? 'text-purple-400' :
                              item.theme === 'amber' ? 'text-amber-400' :
                                item.theme === 'cyan' ? 'text-cyan-400' : 'text-slate-white/70'
                              }`} />
                            <span>{t(item.key)}</span>
                          </div>
                          {item.badge && (
                            <Badge className={`text-xs ${item.theme === 'purple' ? 'bg-purple-500/30 text-purple-200 border-purple-400/30' :
                              item.theme === 'amber' ? 'bg-amber-500/30 text-amber-200 border-amber-400/30' :
                                item.theme === 'cyan' ? 'bg-cyan-500/30 text-cyan-200 border-cyan-400/30' : ''
                              }`}>
                              {item.badge}
                            </Badge>
                          )}
                        </button>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </div>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>


        {/* Settings at bottom */}
        <div className="mt-auto p-4 border-t border-slate-white/10">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <button
                  onClick={() => handleNavigation('#settings')}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${isActive("#settings")
                    ? "bg-royal-purple text-white"
                    : "text-slate-white/80 hover:bg-slate-white/10 hover:text-white"
                    }`}
                >
                  <Settings className="h-5 w-5" />
                  {!collapsed && <span>{t('admin.settings')}</span>}
                </button>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </div>
      </SidebarContent>
    </Sidebar>
  )
}
