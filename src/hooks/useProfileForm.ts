
import { useState } from "react";
import { User } from "@/types/auth";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

export const useProfileForm = (user: User | null) => {
  const { updatePassword } = useAuth();
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

      // Validate password requirements
      if (!currentPassword) {
        throw new Error("Current password is required");
      }

      if (newPassword.length < 6) {
        throw new Error("New password must be at least 6 characters");
      }

      if (newPassword !== confirmPassword) {
        throw new Error("New passwords don't match");
      }

      // Use the updatePassword function from AuthContext
      await updatePassword(currentPassword, newPassword);

      // Handle success
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
