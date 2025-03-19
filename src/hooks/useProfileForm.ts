
import { useState } from "react";
import { User } from "@/types/auth";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const useProfileForm = (user: User | null) => {
  const [name, setName] = useState(user?.name || "");
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
      
      // Prepare update data with full_name field to match database schema
      const updateData = {
        full_name: name.trim()
      };
      
      const { error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', user.id);
        
      if (error) throw error;
      
      // After successful update, update the user object in memory
      user.name = name.trim();
      
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

      // First verify the current password by attempting to sign in
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: currentPassword
      });

      if (signInError) {
        throw new Error("Current password is incorrect");
      }

      // Then update the password - without passing the currentPassword property
      const { error } = await supabase.auth.updateUser({
        password: newPassword
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
