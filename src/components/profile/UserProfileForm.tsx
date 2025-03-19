
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { User } from "@/types/auth";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface UserProfileFormProps {
  user: User;
}

export const UserProfileForm: React.FC<UserProfileFormProps> = ({ user }) => {
  const { updateProfile } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="bg-gray-50 p-4 rounded-lg space-y-3">
      <div className="grid grid-cols-3 text-sm items-center">
        <div className="text-gray-500">ID</div>
        <div className="col-span-2 font-medium">{user.id}</div>
      </div>
    </div>
  );
};
