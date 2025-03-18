
import React from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { User } from "@/types/auth";
import { AtSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserRound } from "lucide-react";

interface ProfileAvatarProps {
  user: User;
  isEditing: boolean;
  onEditProfile: () => void;
}

export const ProfileAvatar: React.FC<ProfileAvatarProps> = ({ 
  user, 
  isEditing, 
  onEditProfile 
}) => {
  const getUserInitials = () => {
    return user.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <Card className="border-0 shadow-md text-center overflow-hidden">
      <div className="h-1.5 bg-gradient-to-r from-indigo-500 to-purple-500"></div>
      <CardContent className="p-6">
        <div className="flex justify-center mb-4">
          <Avatar className="h-28 w-28">
            <AvatarFallback className="bg-gradient-to-r from-pos-purple to-pos-pink text-white text-3xl">
              {getUserInitials()}
            </AvatarFallback>
          </Avatar>
        </div>
        <h2 className="text-xl font-semibold">{user.name}</h2>
        <p className="text-gray-500 mb-1">{user.email}</p>
        {user.username && (
          <p className="text-gray-500 flex items-center justify-center">
            <AtSign className="h-3 w-3 mr-1" />
            {user.username}
          </p>
        )}
        <div className="mt-6">
          {!isEditing && (
            <Button 
              className="w-full button-gradient" 
              variant="default"
              onClick={onEditProfile}
            >
              <UserRound className="mr-2 h-4 w-4" />
              Edit Profile
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

// Import at the top of the file
import { Card, CardContent } from "@/components/ui/card";
