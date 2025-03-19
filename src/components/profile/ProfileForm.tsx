
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { User } from "@/types/auth";
import { Loader2, UserRound, Mail, Shield, EyeOff, Eye } from "lucide-react";

interface ProfileFormProps {
  user: User;
  name: string;
  isEditing: boolean;
  isLoading: boolean;
  isChangingPassword: boolean;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
  setName: (name: string) => void;
  setCurrentPassword: (password: string) => void;
  setNewPassword: (password: string) => void;
  setConfirmPassword: (password: string) => void;
  setIsChangingPassword: (isChanging: boolean) => void;
  handleCancelEdit: () => void;
  handleSaveChanges: () => void;
  handleChangePassword: () => void;
}

export const ProfileForm: React.FC<ProfileFormProps> = ({
  user,
  name,
  isEditing,
  isLoading,
  isChangingPassword,
  currentPassword,
  newPassword,
  confirmPassword,
  setName,
  setCurrentPassword,
  setNewPassword,
  setConfirmPassword,
  setIsChangingPassword,
  handleCancelEdit,
  handleSaveChanges,
  handleChangePassword
}) => {
  const [showCurrentPassword, setShowCurrentPassword] = React.useState(false);
  const [showNewPassword, setShowNewPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

  return (
    <Card className="border-0 shadow-md overflow-hidden">
      <div className="h-1.5 bg-gradient-to-r from-purple-500 to-indigo-500"></div>
      <CardHeader>
        <CardTitle className="text-xl">Account Information</CardTitle>
        <CardDescription>Your personal details and preferences</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center text-gray-700">
              <UserRound className="h-4 w-4 mr-2 text-indigo-600" />
              <span className="font-medium">Personal Details</span>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg space-y-3">
              <div className="grid grid-cols-3 items-center">
                <div className="text-gray-500">Full Name</div>
                <div className="col-span-2">
                  {isEditing ? (
                    <Input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your name"
                      className="bg-white"
                    />
                  ) : (
                    <div className="font-medium">{user.name || "Not set"}</div>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-3 text-sm">
                <div className="text-gray-500">User ID</div>
                <div className="col-span-2 font-medium">{user.id}</div>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center text-gray-700">
              <Mail className="h-4 w-4 mr-2 text-purple-600" />
              <span className="font-medium">Contact Information</span>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              <div className="grid grid-cols-3 text-sm items-center">
                <div className="text-gray-500">Email</div>
                <div className="col-span-2 font-medium flex items-center">
                  {user.email}
                  {!isEditing && (
                    <span className="ml-2 text-xs text-gray-400">(Cannot be changed)</span>
                  )}
                </div>
              </div>
            </div>
          </div>
          
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
                <div className="mt-3 space-y-3 border-t pt-3">
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">Current Password</label>
                    <div className="relative">
                      <Input
                        type={showCurrentPassword ? "text" : "password"}
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="bg-white pr-10"
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      >
                        {showCurrentPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">New Password</label>
                    <div className="relative">
                      <Input
                        type={showNewPassword ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="bg-white pr-10"
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                      >
                        {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">Confirm New Password</label>
                    <div className="relative">
                      <Input
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="bg-white pr-10"
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setIsChangingPassword(false);
                        setCurrentPassword("");
                        setNewPassword("");
                        setConfirmPassword("");
                      }}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="default"
                      size="sm"
                      onClick={handleChangePassword}
                      disabled={isLoading}
                      className="flex-1 button-gradient"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Updating...
                        </>
                      ) : (
                        "Update Password"
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
      {isEditing && (
        <CardFooter className="flex justify-between flex-wrap gap-2">
          <Button 
            variant="outline" 
            className="flex-1"
            onClick={handleCancelEdit}
          >
            Cancel
          </Button>
          <Button 
            className="button-gradient flex-1"
            onClick={handleSaveChanges}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};
