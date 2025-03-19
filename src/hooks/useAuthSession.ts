
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@/types/auth";

export const useAuthSession = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session) {
          console.log("Auth state changed, fetching profile for user:", session.user.id);
          // Fetch the user profile from the 'profiles' table
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          console.log("Profile data retrieved:", profile, "Error:", error);

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
        console.log("Initial session check, fetching profile for user:", session.user.id);
        // Fetch the user profile from the 'profiles' table
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        console.log("Initial profile data retrieved:", profile, "Error:", error);

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
