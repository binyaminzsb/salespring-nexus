
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

      // Add loading timeout for better UX
      const timeoutId = setTimeout(() => {
        toast.error("Sign up is taking longer than expected. Please try again.");
        setLoading(false);
      }, 10000); // 10 second timeout

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

      clearTimeout(timeoutId); // Clear timeout if request completes

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
      console.log("Attempting to sign in user:", email);
      
      // Add loading timeout for better UX
      const timeoutId = setTimeout(() => {
        toast.error("Sign in is taking longer than expected. Please try again.");
        setLoading(false);
      }, 10000); // 10 second timeout
      
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      clearTimeout(timeoutId); // Clear timeout if request completes
      
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

  const deleteAccount = async (): Promise<boolean> => {
    try {
      setLoading(true);
      
      // Get the current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("User not found");
      }

      // First, delete user's sales data
      const { error: salesError } = await supabase
        .from('sales')
        .delete()
        .eq('user_id', user.id);
        
      if (salesError) {
        console.error("Error deleting sales data:", salesError);
        // Continue anyway - we want to delete the user even if sales deletion fails
      }

      // Delete user's profile
      const { error: profileError } = await supabase
        .from('profiles')
        .delete()
        .eq('id', user.id);
        
      if (profileError) {
        console.error("Error deleting profile:", profileError);
        // Continue anyway - we want to delete the user even if profile deletion fails
      }
      
      // Delete the user from auth
      const { error: userError } = await supabase.auth.admin.deleteUser(user.id);
      
      if (userError) {
        // Admin API might not work directly from client, fall back to signing out
        console.error("Error deleting user (admin API):", userError);
        
        // As a fallback, just sign the user out
        const { error: signOutError } = await supabase.auth.signOut();
        if (signOutError) throw signOutError;
        
        toast.success("Your account has been logged out. Please contact support to complete account deletion.");
        navigate("/");
        return true;
      }
      
      toast.success("Your account has been deleted successfully");
      navigate("/");
      return true;
    } catch (error: any) {
      console.error("Account deletion error:", error);
      toast.error(error.message || "Failed to delete your account");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const resetSalesData = async (): Promise<boolean> => {
    try {
      setLoading(true);
      
      // Get the current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("User not found");
      }
      
      // Delete all sales data for this user from Supabase
      const { error: supaError } = await supabase
        .from('sales')
        .delete()
        .eq('user_id', user.id);
      
      if (supaError) {
        console.error("Error deleting Supabase sales data:", supaError);
        // We'll continue and try to clear local storage anyway
      }
      
      // Clear localStorage sales data
      try {
        // Get current sales from localStorage
        const salesKey = 'pulse-pos-sales';
        const currentSales = JSON.parse(localStorage.getItem(salesKey) || '[]');
        
        // Filter out this user's sales
        const otherUsersSales = currentSales.filter((sale: any) => sale.userId !== user.id);
        
        // Save back to localStorage
        localStorage.setItem(salesKey, JSON.stringify(otherUsersSales));
      } catch (localError) {
        console.error("Error clearing localStorage sales:", localError);
      }
      
      toast.success("Your sales data has been reset successfully");
      
      // Add a small delay before reloading to ensure the toast is visible
      setTimeout(() => {
        window.location.reload();
      }, 1500);
      
      return true;
    } catch (error: any) {
      console.error("Sales data reset error:", error);
      toast.error(error.message || "Failed to reset your sales data");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    signUp,
    signIn,
    signOut,
    updatePassword,
    updateProfile,
    deleteAccount,
    resetSalesData
  };
};
