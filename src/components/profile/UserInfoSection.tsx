
import React from "react";
import { Mail } from "lucide-react";
import { User } from "@/types/auth";

interface UserInfoSectionProps {
  user: User;
}

export const UserInfoSection: React.FC<UserInfoSectionProps> = ({ user }) => {
  return (
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
            <span className="ml-2 text-xs text-gray-400">(Cannot be changed)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
