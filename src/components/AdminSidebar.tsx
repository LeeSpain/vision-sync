import { useState } from "react"
import { NavLink, useLocation } from "react-router-dom"
import { 
  LayoutDashboard, 
  FolderOpen, 
  Users, 
  FileText, 
  Settings, 
  Plus,
  BarChart3,
  Eye,
  LogOut
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

const mainItems = [
  { title: "Dashboard", url: "#overview", icon: LayoutDashboard },
  { title: "Projects", url: "#projects", icon: FolderOpen },
  { title: "Leads", url: "#leads", icon: Users },
  { title: "Content", url: "#content", icon: FileText },
  { title: "Analytics", url: "#analytics", icon: BarChart3 },
]

const quickActions = [
  { title: "Add Project", url: "#add-project", icon: Plus },
  { title: "View Site", url: "/", icon: Eye, external: true },
]

export function AdminSidebar() {
  const { state } = useSidebar()
  const collapsed = state === "collapsed"
  const location = useLocation()
  const hash = location.hash || "#overview"

  const isActive = (path: string) => hash === path

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
                  <a 
                    href={item.url}
                    className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                      isActive(item.url) 
                        ? "bg-royal-purple text-white" 
                        : "text-slate-white/80 hover:bg-slate-white/10 hover:text-white"
                    }`}
                  >
                    <item.icon className="h-5 w-5" />
                    {!collapsed && <span>{item.title}</span>}
                  </a>
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
                  {item.external ? (
                    <a 
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-3 px-3 py-2 rounded-lg text-slate-white/80 hover:bg-slate-white/10 hover:text-white transition-colors"
                    >
                      <item.icon className="h-5 w-5" />
                      {!collapsed && <span>{item.title}</span>}
                    </a>
                  ) : (
                    <a 
                      href={item.url}
                      className="flex items-center space-x-3 px-3 py-2 rounded-lg text-slate-white/80 hover:bg-slate-white/10 hover:text-white transition-colors"
                    >
                      <item.icon className="h-5 w-5" />
                      {!collapsed && <span>{item.title}</span>}
                    </a>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Settings at bottom */}
        <div className="mt-auto p-4 border-t border-slate-white/10">
          <SidebarMenu>
            <SidebarMenuItem>
                <a 
                  href="#settings"
                  className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                    isActive("#settings") 
                      ? "bg-royal-purple text-white" 
                      : "text-slate-white/80 hover:bg-slate-white/10 hover:text-white"
                  }`}
                >
                  <Settings className="h-5 w-5" />
                  {!collapsed && <span>Settings</span>}
                </a>
            </SidebarMenuItem>
          </SidebarMenu>
        </div>
      </SidebarContent>
    </Sidebar>
  )
}