
import React from "react";
import { Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PasswordChange } from "./PasswordChange";

interface SecuritySectionProps {
  isChangingPassword: boolean;
  setIsChangingPassword: (isChanging: boolean) => void;
  isLoading: boolean;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
  setCurrentPassword: (password: string) => void;
  setNewPassword: (password: string) => void;
  setConfirmPassword: (password: string) => void;
  handleChangePassword: () => void;
}

export const SecuritySection: React.FC<SecuritySectionProps> = ({
  isChangingPassword,
  setIsChangingPassword,
  isLoading,
  currentPassword,
  newPassword,
  confirmPassword,
  setCurrentPassword,
  setNewPassword,
  setConfirmPassword,
  handleChangePassword
}) => {
  const handleCancel = () => {
    setIsChangingPassword(false);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center text-gray-700">
        <Shield className="h-4 w-4 mr-2 text-pink-600" />
        <span className="font-medium">Security Settings</span>
      </div>
      <div className="bg-gray-50 p-4 rounded-lg space-y-2">
        <div className="grid grid-cols-3 text-sm items-center">
          <div className="text-gray-500">Password</div>
          <div className="col-span-2 font-medium flex items-center">
            ••••••••
            {!isChangingPassword && (
              <Button 
                variant="link" 
                size="sm" 
                className="ml-2 text-blue-600 p-0 h-auto"
                onClick={() => setIsChangingPassword(true)}
              >
                Change
              </Button>
            )}
          </div>
        </div>
        
        {isChangingPassword && (
          <PasswordChange 
            isLoading={isLoading}
            currentPassword={currentPassword}
            newPassword={newPassword}
            confirmPassword={confirmPassword}
            setCurrentPassword={setCurrentPassword}
            setNewPassword={setNewPassword}
            setConfirmPassword={setConfirmPassword}
            handleChangePassword={handleChangePassword}
            onCancel={handleCancel}
          />
        )}
      </div>
    </div>
  );
};
