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
  Eye,
  LogOut,
  Mail,
  TrendingUp,
  DollarSign,
  Brain,
  MessageCircle,
  Package,
  Building2
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
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { projectManager } from "@/utils/projectManager"
import { supabaseLeadManager } from "@/utils/supabaseLeadManager"
import { supabase } from "@/integrations/supabase/client"

const mainItems = [
  { title: "Dashboard", url: "#overview", icon: LayoutDashboard },
  { title: "Messages", url: "#messages", icon: Mail },
  { title: "AI Conversations", url: "#conversations", icon: MessageCircle },
  { title: "Projects", url: "#projects", icon: FolderOpen },
  { title: "Templates", url: "#templates", icon: FileText },
  { title: "Industries", url: "#industries", icon: Building2 },
  { title: "Leads", url: "#leads", icon: Users },
  { title: "Sales Pipeline", url: "#sales-pipeline", icon: TrendingUp },
  { title: "AI Agent", url: "#ai-agent", icon: Brain },
  { title: "Content", url: "#content", icon: FileText },
  { title: "Analytics", url: "#analytics", icon: BarChart3 },
]

const quickActions = [
  { title: "Add Project", url: "#add-project", icon: Plus },
]

export function AdminSidebar() {
  const { state } = useSidebar()
  const collapsed = state === "collapsed"
  const location = useLocation()
  const navigate = useNavigate()
  const hash = location.hash || "#overview"
  
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
      const allLeads = await supabaseLeadManager.getAllLeads();
      // Count only non-archived leads
      const activeLeads = allLeads.filter(lead => lead.status !== 'archived').length;
      
      setLeadStats({
        totalLeads: activeLeads
      });
    } catch (error) {
      console.error('Error loading lead stats:', error);
    }
  };

  const loadConversationStats = async () => {
    try {
      const { data, error } = await supabase
        .from('ai_conversations')
        .select('id');
      
      if (error) throw error;
      
      setConversationStats({
        totalConversations: data?.length || 0
      });
    } catch (error) {
      console.error('Error loading conversation stats:', error);
    }
  };

  // Simple active state detection based on hash
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
                <p className="text-xs text-slate-white/60">Admin Panel</p>
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
            {!collapsed && "Main Menu"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <button 
                      onClick={() => handleNavigation(item.url)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${
                        isActive(item.url) 
                          ? "bg-royal-purple text-white" 
                          : "text-slate-white/80 hover:bg-slate-white/10 hover:text-white"
                      }`}
                      >
                    <div className="flex items-center space-x-3">
                      <item.icon className="h-5 w-5" />
                      {!collapsed && <span>{item.title}</span>}
                    </div>
                    {!collapsed && item.title === "Projects" && (
                      <Badge variant="secondary" className="bg-royal-purple/20 text-royal-purple border-0">
                        {projectStats.totalProjects}
                      </Badge>
                    )}
                    {!collapsed && item.title === "Leads" && (
                      <Badge variant="secondary" className="bg-emerald-green/20 text-emerald-green border-0">
                        {leadStats.totalLeads}
                      </Badge>
                    )}
                    {!collapsed && item.title === "AI Conversations" && (
                      <Badge variant="secondary" className="bg-electric-blue/20 text-electric-blue border-0">
                        {conversationStats.totalConversations}
                      </Badge>
                    )}
                    </button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>


        {/* Quick Actions */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-slate-white/60">
            {!collapsed && "Quick Actions"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {quickActions.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <button 
                      onClick={() => handleNavigation(item.url)}
                      className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-slate-white/80 hover:bg-slate-white/10 hover:text-white transition-colors"
                    >
                      <item.icon className="h-5 w-5" />
                      {!collapsed && <span>{item.title}</span>}
                    </button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
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
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                    isActive("#settings") 
                      ? "bg-royal-purple text-white" 
                      : "text-slate-white/80 hover:bg-slate-white/10 hover:text-white"
                  }`}
                >
                  <Settings className="h-5 w-5" />
                  {!collapsed && <span>Settings</span>}
                </button>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </div>
      </SidebarContent>
    </Sidebar>
  )
}