import { ReactNode } from 'react';
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from './AdminSidebar';
import { Button } from '@/components/ui/button';
import { LogOut, Menu } from 'lucide-react';
import { useAuthContext } from '@/contexts/AuthContext';
import { LanguageSwitcher } from '@/components/common/LanguageSwitcher';

interface AdminLayoutProps {
  children: ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const { user, signOut } = useAuthContext();
  const userName = user?.user_metadata?.display_name || user?.email?.split('@')[0] || 'Admin';
  const initial = userName.charAt(0).toUpperCase();
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-hero">
        <AdminSidebar />

        <div className="flex-1 flex flex-col">
          {/* Top bar with sidebar trigger */}
          <header className="h-16 border-b border-slate-white/10 bg-midnight-navy flex items-center px-6">
            <SidebarTrigger className="text-slate-white hover:bg-slate-white/10" />

            <div className="ml-4 flex-1">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-xl font-heading font-bold text-slate-white mb-1">
                    Welcome back, {userName}! 👋
                  </h1>
                  <p className="text-sm text-slate-white/70">
                    {new Date().toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })} • Vision-Sync Command Center
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-sm font-medium text-slate-white">
                      {new Date().toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true
                      })}
                    </div>
                    <div className="text-xs text-slate-white/70">Local Time</div>
                  </div>

                  <LanguageSwitcher variant="inline" />

                  <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-slate-white">{initial}</span>
                  </div>

                  <span className="text-sm text-slate-white/70 ml-2 mr-2 hidden md:block">{user?.email}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={signOut}
                    className="text-slate-white/70 hover:text-slate-white hover:bg-slate-white/10"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </Button>
                </div>
              </div>
            </div>
          </header>

          {/* Main content area */}
          <main className="flex-1 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}