
import { useState } from "react";
import { User } from "@/types/auth";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const useProfileForm = (user: User | null) => {
  const [name, setName] = useState(user?.name || "");
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleEditProfile = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setName(user?.name || "");
    setIsEditing(false);
  };

  const handleSaveChanges = async () => {
    if (!user) return;
    
    if (name.trim().length < 2) {
      toast.error("Name must be at least 2 characters");
      return;
    }

    try {
      setIsLoading(true);
      
      const { error } = await supabase
        .from('profiles')
        .update({ full_name: name.trim() })
        .eq('id', user.id);
        
      if (error) throw error;
      
      toast.success("Profile updated successfully");
      setIsEditing(false);
    } catch (error: any) {
      toast.error(error.message || "Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    name,
    setName,
    isEditing,
    isLoading,
    handleEditProfile,
    handleCancelEdit,
    handleSaveChanges
  };
};
