import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';

export const AdminRoute = ({ children }: { children: React.ReactNode }) => {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-hero">
                <div className="flex flex-col items-center">
                    <Loader2 className="h-8 w-8 animate-spin text-royal-purple mb-4" />
                    <p className="text-midnight-navy font-medium">Verifying access...</p>
                </div>
            </div>
        );
    }

    // In a production app, you should also verify the user's role here
    // typically by checking a custom claim or querying a user_roles table
    // For now, we ensure they are authenticated
    if (!user) {
        // Redirect to auth page and save the attempted URL
        return <Navigate to="/auth" state={{ from: location }} replace />;
    }

    return <>{children}</>;
};
