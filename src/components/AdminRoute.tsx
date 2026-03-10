import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';

export const AdminRoute = ({ children }: { children: React.ReactNode }) => {
    const { user, loading, adminStatus } = useAuth();
    const location = useLocation();

    if (loading || (user && adminStatus === 'unknown')) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-hero">
                <div className="flex flex-col items-center">
                    <Loader2 className="h-8 w-8 animate-spin text-royal-purple mb-4" />
                    <p className="text-midnight-navy font-medium">Verifying access...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/auth" state={{ from: location }} replace />;
    }

    if (adminStatus !== 'admin') {
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
};
