
import React from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { User } from "@/types/auth";
import { Card, CardContent } from "@/components/ui/card";

interface ProfileAvatarProps {
  user: User;
}

export const ProfileAvatar: React.FC<ProfileAvatarProps> = ({ user }) => {
  console.log("ProfileAvatar received user:", user);
  
  const getUserInitials = () => {
    if (user.name) {
      return user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase();
    }
    return user.email ? user.email[0].toUpperCase() : "U";
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
        <p className="font-medium text-gray-800 mb-1">{user.name || "User"}</p>
        <p className="text-gray-500">{user.email}</p>
      </CardContent>
    </Card>
  );
};
