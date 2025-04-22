
import { useState } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

export const useAccountManagement = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const deleteAccount = async (): Promise<boolean> => {
    try {
      setLoading(true);
      
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("User not found");
      }

      const { error: salesError } = await supabase
        .from('sales')
        .delete()
        .eq('user_id', user.id);
        
      if (salesError) {
        console.error("Error deleting sales data:", salesError);
      }

      const { error: profileError } = await supabase
        .from('profiles')
        .delete()
        .eq('id', user.id);
        
      if (profileError) {
        console.error("Error deleting profile:", profileError);
      }
      
      const { error: userError } = await supabase.auth.admin.deleteUser(user.id);
      
      if (userError) {
        console.error("Error deleting user (admin API):", userError);
        
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
      
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("User not found");
      }
      
      const { error: supaError } = await supabase
        .from('sales')
        .delete()
        .eq('user_id', user.id);
      
      if (supaError) {
        console.error("Error deleting Supabase sales data:", supaError);
      }
      
      try {
        const salesKey = 'pulse-pos-sales';
        const currentSales = JSON.parse(localStorage.getItem(salesKey) || '[]');
        const otherUsersSales = currentSales.filter((sale: any) => sale.userId !== user.id);
        localStorage.setItem(salesKey, JSON.stringify(otherUsersSales));
      } catch (localError) {
        console.error("Error clearing localStorage sales:", localError);
      }
      
      toast.success("Your sales data has been reset successfully");
      
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
    deleteAccount,
    resetSalesData
  };
};
