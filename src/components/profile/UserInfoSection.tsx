
import React from "react";
import { Mail, User as UserIcon } from "lucide-react";
import { User } from "@/types/auth";
import { UserProfileForm } from "./UserProfileForm";

interface UserInfoSectionProps {
  user: User;
}

export const UserInfoSection: React.FC<UserInfoSectionProps> = ({ user }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center text-gray-700">
        <UserIcon className="h-4 w-4 mr-2 text-purple-600" />
        <span className="font-medium">Personal Information</span>
      </div>
      <UserProfileForm user={user} />

      <div className="flex items-center text-gray-700 mt-4">
        <Mail className="h-4 w-4 mr-2 text-purple-600" />
        <span className="font-medium">Contact Information</span>
      </div>
      <div className="bg-gray-50 p-4 rounded-lg space-y-3">
        <div className="grid grid-cols-3 text-sm items-center">
          <div className="text-gray-500">Email</div>
          <div className="col-span-2 font-medium flex items-center">
            {user.email}
            <span className="ml-2 text-xs text-gray-400">(Cannot be changed)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
