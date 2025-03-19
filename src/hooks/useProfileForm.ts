
import { useState } from "react";
import { User } from "@/types/auth";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

// Separate password validation into its own function
const validatePassword = (currentPassword: string, newPassword: string, confirmPassword: string) => {
  if (!currentPassword) {
    throw new Error("Current password is required");
  }

  if (newPassword.length < 6) {
    throw new Error("New password must be at least 6 characters");
  }

  if (newPassword !== confirmPassword) {
    throw new Error("New passwords don't match");
  }
};

// Separate authentication verification into its own function
const verifyCurrentPassword = async (email: string, currentPassword: string) => {
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password: currentPassword
  });

  if (error) {
    console.error("Current password verification failed:", error);
    throw new Error("Current password is incorrect");
  }
};

// Separate password update into its own function
const updateUserPassword = async (newPassword: string) => {
  const { error } = await supabase.auth.updateUser({
    password: newPassword
  });

  if (error) {
    console.error("Password update failed:", error);
    throw error;
  }
};

export const useProfileForm = (user: User | null) => {
  const [isLoading, setIsLoading] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const resetPasswordFields = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const handleChangePassword = async () => {
    if (!user) {
      toast.error("User not authenticated");
      return;
    }

    try {
      setIsLoading(true);
      console.log("Attempting to change password for:", user.email);

      // Step 1: Validate password requirements
      validatePassword(currentPassword, newPassword, confirmPassword);

      // Step 2: Verify current password
      await verifyCurrentPassword(user.email, currentPassword);

      // Step 3: Update the password
      await updateUserPassword(newPassword);

      // Step 4: Handle success
      toast.success("Password updated successfully");
      setIsChangingPassword(false);
      resetPasswordFields();
    } catch (error: any) {
      toast.error(error.message || "Failed to update password");
      console.error("Password change error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
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
