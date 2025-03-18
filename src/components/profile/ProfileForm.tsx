
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { User } from "@/types/auth";
import { Loader2, UserRound, AtSign, Mail, Shield } from "lucide-react";

interface ProfileFormProps {
  user: User;
  name: string;
  isEditing: boolean;
  isLoading: boolean;
  setName: (name: string) => void;
  handleCancelEdit: () => void;
  handleSaveChanges: () => void;
}

export const ProfileForm: React.FC<ProfileFormProps> = ({
  user,
  name,
  isEditing,
  isLoading,
  setName,
  handleCancelEdit,
  handleSaveChanges
}) => {
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
                    <div className="font-medium">{user.name}</div>
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
              <AtSign className="h-4 w-4 mr-2 text-blue-600" />
              <span className="font-medium">Username</span>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              <div className="grid grid-cols-3 text-sm items-center">
                <div className="text-gray-500">Username</div>
                <div className="col-span-2 font-medium flex items-center">
                  {user.username || "No username set"}
                  {!isEditing && (
                    <span className="ml-2 text-xs text-gray-400">(Cannot be changed)</span>
                  )}
                </div>
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
              <div className="grid grid-cols-3 text-sm">
                <div className="text-gray-500">Password</div>
                <div className="col-span-2 font-medium">••••••••</div>
              </div>
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
