
import React, { useState } from "react";
import { Mail, User as UserIcon, CheckCircle, Edit2 } from "lucide-react";
import { User } from "@/types/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface UserInfoSectionProps {
  user: User;
}

export const UserInfoSection: React.FC<UserInfoSectionProps> = ({ user }) => {
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameValue, setNameValue] = useState(user.name || "");
  const [isUpdating, setIsUpdating] = useState(false);

  const updateFullName = async () => {
    if (!nameValue.trim()) {
      toast.error("Name cannot be empty");
      return;
    }

    try {
      setIsUpdating(true);
      const { error } = await supabase
        .from('profiles')
        .update({ full_name: nameValue.trim() })
        .eq('id', user.id);

      if (error) throw error;

      toast.success("Name updated successfully!");
      setIsEditingName(false);
      
      // Reload the page to reflect the changes
      window.location.reload();
    } catch (error: any) {
      toast.error(error.message || "Failed to update name");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center text-gray-700">
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
        
        <div className="grid grid-cols-3 text-sm items-center">
          <div className="text-gray-500">Full Name</div>
          <div className="col-span-2">
            {isEditingName ? (
              <div className="flex items-center gap-2">
                <Input 
                  value={nameValue}
                  onChange={(e) => setNameValue(e.target.value)}
                  className="h-8 py-1 px-2 text-sm"
                  placeholder="Enter your full name"
                />
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className="h-8 p-1" 
                  onClick={() => setIsEditingName(false)}
                  disabled={isUpdating}
                >
                  Cancel
                </Button>
                <Button 
                  size="sm" 
                  className="h-8 p-1 bg-green-600 hover:bg-green-700" 
                  onClick={updateFullName}
                  disabled={isUpdating}
                >
                  <CheckCircle className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="font-medium flex items-center">
                {user.name ? user.name : <span className="text-gray-400">Not set</span>}
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="ml-2 h-7 w-7 p-0" 
                  onClick={() => setIsEditingName(true)}
                >
                  <Edit2 className="h-3.5 w-3.5 text-gray-500" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
