import { useState, useEffect, useCallback } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { reportEvent, updateDailyMetrics } from '@/lib/syncHub';

export interface UserProfile {
  id: string;
  email: string | null;
  first_name: string | null;
  last_name: string | null;
  full_name: string | null;
  avatar_url: string | null;
  role: string | null;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminStatus, setAdminStatus] = useState<'unknown' | 'admin' | 'user'>('unknown');
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const { toast } = useToast();

  const fetchProfile = useCallback(async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (!error && data) {
        setProfile(data as UserProfile);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  }, []);

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        const { data: { session: initialSession } } = await supabase.auth.getSession();
        if (mounted) {
          setSession(initialSession);
          setUser(initialSession?.user ?? null);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error getting session:", error);
        if (mounted) setLoading(false);
      }
    };

    initializeAuth();

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, currentSession) => {
        if (mounted) {
          setSession(currentSession);
          setUser(currentSession?.user ?? null);

          // Check admin status
          if (currentSession?.user) {
            // Defer Supabase calls and only end loading after admin check completes
            setTimeout(() => {
              Promise.all([
                checkAdminStatus(currentSession.user!.id),
                fetchProfile(currentSession.user!.id)
              ]).finally(() => {
                setLoading(false);
              });
            }, 0);
          } else {
            setIsAdmin(false);
            setAdminStatus('unknown');
            setProfile(null);
            setLoading(false);
          }
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (mounted) {
        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          Promise.all([
            checkAdminStatus(session.user.id),
            fetchProfile(session.user.id)
          ]).finally(() => {
            setLoading(false);
          });
        } else {
          setAdminStatus('unknown');
          setLoading(false);
        }
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [fetchProfile]);

  const checkAdminStatus = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles' as any)
        .select('role')
        .eq('id', userId)
        .single();

      if (!error && data) {
        const isAdminRole = (data as any).role === 'admin';
        setIsAdmin(isAdminRole);
        setAdminStatus(isAdminRole ? 'admin' : 'user');
      } else {
        setIsAdmin(false);
        setAdminStatus('user');
      }
    } catch (error) {
      setIsAdmin(false);
      setAdminStatus('user');
    }
  };

  const refreshProfile = useCallback(async () => {
    if (user?.id) {
      await fetchProfile(user.id);
    }
  }, [user?.id, fetchProfile]);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      toast({
        title: "Sign In Error",
        description: error.message,
        variant: "destructive"
      });
    }

    return { error };
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    const redirectUrl = `${window.location.origin}/`;

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          full_name: fullName
        }
      }
    });

    if (error) {
      toast({
        title: "Sign Up Error",
        description: error.message,
        variant: "destructive"
      });
    } else {
      toast({
        title: "Success!",
        description: "Please check your email to confirm your account."
      });

      // Sync Hub Reporting
      await reportEvent('new_signup', {
        label: `New Vision-Sync member — ${fullName}`,
        metadata: { name: fullName }
      });
      await updateDailyMetrics({ newSignups: 1 });
    }

    return { error };
  };


  const signOut = async () => {
    // Clear local state first to ensure UI updates immediately
    setUser(null);
    setSession(null);
    setIsAdmin(false);
    setAdminStatus('unknown');

    // Then attempt server signout (may fail if session already expired)
    try {
      await supabase.auth.signOut();
    } catch (error) {
      // Session was already invalid, state is already cleared
      console.log('Session already expired');
    }
  };

  return {
    user,
    session,
    loading,
    isAdmin,
    adminStatus,
    profile,
    refreshProfile,
    signIn,
    signUp,
    signOut
  };
};