
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@/types/auth";

export const useAuthApi = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const signUp = async (name: string, email: string, password: string, username: string) => {
    try {
      setLoading(true);
      
      // Check if username already exists
      const { data: existingUsername } = await supabase
        .from('profiles')
        .select('username')
        .eq('username', username)
        .single();

      if (existingUsername) {
        throw new Error("Username already taken");
      }

      // Register with Supabase with email confirmation disabled
      const { error, data } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            username
          },
          emailRedirectTo: `${window.location.origin}/dashboard`,
        }
      });

      if (error) throw error;
      
      // Automatically sign in the user after successful registration
      if (data.user) {
        await supabase.auth.signInWithPassword({
          email,
          password
        });
        
        toast.success("Account created successfully!");
        navigate("/dashboard");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to create account");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (emailOrUsername: string, password: string) => {
    try {
      setLoading(true);
      
      // Check if input is email or username
      const isEmail = emailOrUsername.includes('@');
      
      if (isEmail) {
        // Sign in with email
        const { error } = await supabase.auth.signInWithPassword({
          email: emailOrUsername,
          password
        });
        
        if (error) throw error;
      } else {
        // Get email from username
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('email')
          .eq('username', emailOrUsername)
          .single();
          
        if (profileError || !profile) {
          throw new Error("Invalid username or password");
        }
        
        // Sign in with retrieved email
        const { error } = await supabase.auth.signInWithPassword({
          email: profile.email,
          password
        });
        
        if (error) throw error;
      }
      
      toast.success("Signed in successfully!");
      navigate("/dashboard");
    } catch (error: any) {
      toast.error(error.message || "Failed to sign in");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      toast.error(error.message);
      setLoading(false);
      return;
    }
    
    toast.success("Signed out successfully");
    navigate("/");
    setLoading(false);
  };

  return {
    loading,
    signUp,
    signIn,
    signOut
  };
};
