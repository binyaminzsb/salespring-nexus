
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@/types/auth";

export const useAuthApi = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const signUp = async (email: string, password: string) => {
    try {
      setLoading(true);
      console.log("Attempting to sign up user:", email);

      // Register with Supabase with email confirmation disabled
      const { error, data } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`,
        }
      });

      if (error) throw error;
      
      // Automatically sign in the user after successful registration
      if (data.user) {
        console.log("User registered successfully, now signing in");
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        
        if (signInError) throw signInError;

        // Insert into profiles table directly to ensure data is saved
        const { error: profileError } = await supabase
          .from('profiles')
          .upsert({
            id: data.user.id,
            email: email
          });

        if (profileError) {
          console.error("Error upserting profile:", profileError);
          throw profileError;
        }
        
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

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
      
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
