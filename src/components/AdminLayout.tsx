import { ReactNode } from 'react';
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from './AdminSidebar';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';

interface AdminLayoutProps {
  children: ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-hero">
        <AdminSidebar />
        
        <div className="flex-1 flex flex-col">
          {/* Top bar with sidebar trigger */}
          <header className="h-16 border-b border-slate-white/10 bg-midnight-navy flex items-center px-6">
            <SidebarTrigger className="text-slate-white hover:bg-slate-white/10" />
            
            <div className="ml-4">
              <h1 className="text-xl font-heading font-bold text-slate-white">
                Welcome back, Lee! 👋
              </h1>
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