
import { useState } from "react";
import { User } from "@/types/auth";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const useProfileForm = (user: User | null) => {
  const [name, setName] = useState(user?.name || "");
  const [username, setUsername] = useState(user?.username || "");
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const handleEditProfile = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setName(user?.name || "");
    setUsername(user?.username || "");
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
      
      // Prepare update data
      const updateData: { full_name: string; username?: string } = {
        full_name: name.trim()
      };
      
      // Only update username if it's not set yet and a new one is provided
      if (!user.username && username.trim()) {
        updateData.username = username.trim();
      }
      
      const { error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', user.id);
        
      if (error) throw error;
      
      // After successful update, update the user object in memory
      user.name = name.trim();
      if (!user.username && username.trim()) {
        user.username = username.trim();
      }
      
      toast.success("Profile updated successfully");
      setIsEditing(false);
    } catch (error: any) {
      toast.error(error.message || "Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (!user) return;

    if (newPassword.length < 6) {
      toast.error("New password must be at least 6 characters");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("New passwords don't match");
      return;
    }

    if (!currentPassword) {
      toast.error("Current password is required");
      return;
    }

    try {
      setIsLoading(true);

      // Update the password directly
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
        currentPassword: currentPassword
      });

      if (error) throw error;

      toast.success("Password updated successfully");
      setIsChangingPassword(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      toast.error(error.message || "Failed to update password");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    name,
    setName,
    username,
    setUsername,
    isEditing,
    isLoading,
    handleEditProfile,
    handleCancelEdit,
    handleSaveChanges,
    currentPassword,
    setCurrentPassword,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    isChangingPassword,
    setIsChangingPassword,
    handleChangePassword
  };
};
