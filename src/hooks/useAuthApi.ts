import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@/types/auth";
import { SALES_KEY } from "@/utils/cartUtils";

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
      
      // If user registration was successful
      if (data.user) {
        console.log("User registered successfully:", data.user.id);
        
        // Sign in the user after successful registration
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        
        if (signInError) throw signInError;
        
        // Create or update profile record with proper RLS handling
        const { error: profileError } = await supabase
          .from('profiles')
          .upsert({ 
            id: data.user.id,
            email: email 
          }, {
            onConflict: 'id'
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

  const deleteAccount = async () => {
    try {
      setLoading(true);
      
      // Get the current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("User not found");
      }
      
      // Delete user-related data from Supabase
      // 1. Delete user's profile data
      const { error: profileDeleteError } = await supabase
        .from('profiles')
        .delete()
        .eq('id', user.id);
        
      if (profileDeleteError) {
        console.error("Error deleting profile:", profileDeleteError);
      }
      
      // 2. Delete user's sales data
      const { error: salesDeleteError } = await supabase
        .from('sales')
        .delete()
        .eq('user_id', user.id);
        
      if (salesDeleteError) {
        console.error("Error deleting sales:", salesDeleteError);
      }
      
      // 3. Delete the user's account from Supabase
      const { error: userDeleteError } = await supabase.auth.admin.deleteUser(user.id);
      
      if (userDeleteError) {
        // If admin deletion fails (which it might in development), try regular sign out
        await supabase.auth.signOut();
        throw new Error("Cannot delete user account directly. Please contact support.");
      }
      
      // 4. Clear local storage data
      localStorage.removeItem(SALES_KEY);
      
      toast.success("Account deleted successfully");
      navigate("/");
      return true;
    } catch (error: any) {
      console.error("Account deletion error:", error);
      toast.error(error.message || "Failed to delete account");
      throw error;
    } finally {
      setLoading(false);
    }
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
      
      toast.success("Password updated successfully");
      return true;
    } catch (error: any) {
      console.error("Password update error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (data: Partial<User>) => {
    try {
      setLoading(true);
      
      // Get the current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("User not found");
      }
      
      // Update the profile in the profiles table
      const { error } = await supabase
        .from('profiles')
        .update({ 
          ...data
        })
        .eq('id', user.id);
      
      if (error) {
        throw error;
      }
      
      toast.success("Profile updated successfully");
      return true;
    } catch (error: any) {
      console.error("Profile update error:", error);
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
    deleteAccount,
    updatePassword,
    updateProfile
  };
};
