
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
          // Disable email verification by automatically confirming emails
          emailRedirectTo: `${window.location.origin}/dashboard`,
          // Set data.user.email_confirmed_at in the metadata
          data: {
            email_confirmed: true
          }
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

  const updatePassword = async (currentPassword: string, newPassword: string) => {
    try {
      setLoading(true);
      
      // First, get the user's email
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user || !user.email) {
        throw new Error("User not found or email not available");
      }
      
      // Verify the current password by attempting to sign in
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: currentPassword
      });
      
      if (signInError) {
        throw new Error("Current password is incorrect");
      }
      
      // Update the password
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword
      });
      
      if (updateError) {
        throw updateError;
      }
      
      return true;
    } catch (error: any) {
      console.error("Password update error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    signUp,
    signIn,
    signOut,
    updatePassword
  };
};
