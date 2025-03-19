
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@/types/auth";

export const useAuthSession = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('email, full_name')
      .eq('id', userId)
      .single();
    
    if (error) {
      console.error("Error fetching user profile:", error);
      return null;
    }
    
    return data;
  };

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session) {
          console.log("Auth state changed, fetching profile for user:", session.user.id);
          
          // Fetch user profile from profiles table
          const profile = await fetchUserProfile(session.user.id);
          
          // Set user with information from auth and profiles
          setUser({
            id: session.user.id,
            email: session.user.email || '',
            name: profile?.full_name || '',
          });
        } else {
          setUser(null);
        }
        setLoading(false);
      }
    );

    // Initial session check
    const initializeAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        console.log("Initial session check for user:", session.user.id);
        
        // Fetch user profile from profiles table
        const profile = await fetchUserProfile(session.user.id);
        
        setUser({
          id: session.user.id,
          email: session.user.email || '',
          name: profile?.full_name || '',
        });
      }
      
      setLoading(false);
    };

    initializeAuth();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return { user, setUser, loading };
};
