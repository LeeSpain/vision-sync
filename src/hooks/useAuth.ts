import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminStatus, setAdminStatus] = useState<'unknown' | 'admin' | 'user'>('unknown');
  const { toast } = useToast();

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);

        // Check admin status
        if (session?.user) {
          // Defer Supabase calls and only end loading after admin check completes
          setTimeout(() => {
            checkAdminStatus(session.user!.id).finally(() => {
              setLoading(false);
            });
          }, 0);
        } else {
          setIsAdmin(false);
          setAdminStatus('unknown');
          setLoading(false);
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user) {
        checkAdminStatus(session.user.id).finally(() => {
          setLoading(false);
        });
      } else {
        setAdminStatus('unknown');
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

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
    }

    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setIsAdmin(false);
    setAdminStatus('unknown');
  };

  return {
    user,
    session,
    loading,
    isAdmin,
    adminStatus,
    signIn,
    signUp,
    signOut
  };
};