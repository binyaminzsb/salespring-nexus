
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { User } from "@/types/auth";
import { UserInfoSection } from "./UserInfoSection";
import { SecuritySection } from "./SecuritySection";

interface ProfileFormProps {
  user: User;
  isLoading: boolean;
  isChangingPassword: boolean;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
  setCurrentPassword: (password: string) => void;
  setNewPassword: (password: string) => void;
  setConfirmPassword: (password: string) => void;
  setIsChangingPassword: (isChanging: boolean) => void;
  handleChangePassword: () => void;
}

export const ProfileForm: React.FC<ProfileFormProps> = ({
  user,
  isLoading,
  isChangingPassword,
  currentPassword,
  newPassword,
  confirmPassword,
  setCurrentPassword,
  setNewPassword,
  setConfirmPassword,
  setIsChangingPassword,
  handleChangePassword
}) => {
  console.log("ProfileForm received user:", user);

  return (
    <Card className="border-0 shadow-md overflow-hidden">
      <div className="h-1.5 bg-gradient-to-r from-purple-500 to-indigo-500"></div>
      <CardHeader>
        <CardTitle className="text-xl">Account Information</CardTitle>
        <CardDescription>Your personal details and preferences</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Removed the duplicated User ID display from here */}
          
          <UserInfoSection user={user} />
          
          <SecuritySection 
            isChangingPassword={isChangingPassword}
            setIsChangingPassword={setIsChangingPassword}
            isLoading={isLoading}
            currentPassword={currentPassword}
            newPassword={newPassword}
            confirmPassword={confirmPassword}
            setCurrentPassword={setCurrentPassword}
            setNewPassword={setNewPassword}
            setConfirmPassword={setConfirmPassword}
            handleChangePassword={handleChangePassword}
          />
        </div>
      </CardContent>
    </Card>
  );
};
