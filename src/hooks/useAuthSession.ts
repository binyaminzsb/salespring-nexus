
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@/types/auth";

export const useAuthSession = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserProfile = async (userId: string) => {
    console.log("Fetching profile for user ID:", userId);
    
    const { data, error } = await supabase
      .from('profiles')
      .select('email')
      .eq('id', userId)
      .single();
    
    if (error) {
      console.error("Error fetching user profile:", error);
      return null;
    }
    
    console.log("Profile data retrieved:", data);
    return data;
  };

  useEffect(() => {
    // Reduced max loading time from 5s to 3s
    const loadingTimeout = setTimeout(() => {
      setLoading(false);
    }, 3000);

    // Handle auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state change event:", event);
        
        if (session) {
          console.log("Auth state changed, fetching profile for user:", session.user.id);
          
          // Set user immediately with basic info to speed up UI rendering
          setUser({
            id: session.user.id,
            email: session.user.email || ''
          });
          
          // Then fetch profile asynchronously
          fetchUserProfile(session.user.id);
          setLoading(false);
        } else {
          setUser(null);
          setLoading(false);
        }
      }
    );

    // Initial session check
    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          console.log("Initial session check for user:", session.user.id);
          
          // Set user immediately with basic info
          setUser({
            id: session.user.id,
            email: session.user.email || ''
          });
          
          // Then fetch profile asynchronously  
          fetchUserProfile(session.user.id);
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    return () => {
      subscription.unsubscribe();
      clearTimeout(loadingTimeout);
    };
  }, []);

  return { user, setUser, loading };
};
