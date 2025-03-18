
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

interface AccountActionsProps {
  onSignOut: () => void;
}

export const AccountActions: React.FC<AccountActionsProps> = ({ onSignOut }) => {
  return (
    <Card className="border-0 shadow-md mt-6 overflow-hidden">
      <div className="h-1.5 bg-gradient-to-r from-pink-500 to-red-500"></div>
      <CardHeader>
        <CardTitle className="text-lg">Account Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <Button
            variant="destructive"
            className="w-full justify-start"
            onClick={onSignOut}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
