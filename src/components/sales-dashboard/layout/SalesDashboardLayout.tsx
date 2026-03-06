import { ReactNode } from 'react';
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { SalesSidebar } from './SalesSidebar';
import { Button } from '@/components/ui/button';
import { LogOut, Bell } from 'lucide-react';
import { useAuthContext } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface SalesDashboardLayoutProps {
    children: ReactNode;
}

export function SalesDashboardLayout({ children }: SalesDashboardLayoutProps) {
    const { user, signOut } = useAuthContext();
    const navigate = useNavigate();
    const userName = user?.user_metadata?.display_name || user?.email?.split('@')[0] || 'Sales Rep';
    const initial = userName.charAt(0).toUpperCase();

    const handleSignOut = async () => {
        await signOut();
        navigate('/auth');
    };

    return (
        <SidebarProvider>
            <div className="min-h-screen flex w-full bg-slate-100 dark:bg-midnight-navy">
                <SalesSidebar />

                <div className="flex-1 flex flex-col overflow-hidden">
                    {/* Top bar with sidebar trigger */}
                    <header className="h-16 border-b bg-white dark:bg-midnight-navy border-slate-200 dark:border-slate-800 flex items-center px-6 z-10 shadow-sm">
                        <SidebarTrigger className="text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800" />

                        <div className="ml-4 flex-1">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h1 className="text-lg font-heading font-semibold text-slate-900 dark:text-white mb-0.5">
                                        Vision-Sync Sales OS
                                    </h1>
                                </div>

                                <div className="flex items-center gap-4">
                                    <Button variant="ghost" size="icon" className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200">
                                        <Bell className="h-5 w-5" />
                                    </Button>

                                    <div className="w-9 h-9 bg-gradient-brand text-white rounded-full flex items-center justify-center font-bold">
                                        {initial}
                                    </div>

                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={handleSignOut}
                                        className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                                    >
                                        <LogOut className="h-4 w-4 md:mr-2" />
                                        <span className="hidden md:inline">Sign Out</span>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </header>

                    {/* Main content area */}
                    <main className="flex-1 overflow-auto bg-slate-50 dark:bg-midnight-navy/90 p-6">
                        <div className="mx-auto max-w-7xl">
                            {children}
                        </div>
                    </main>
                </div>
            </div>
        </SidebarProvider>
    );
}
