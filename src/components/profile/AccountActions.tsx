
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LogOut, Trash2, RefreshCw, AlertTriangle } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface AccountActionsProps {
  onSignOut: () => void;
  onDeleteAccount?: () => Promise<void>;
  onResetSales?: () => Promise<void>;
}

export const AccountActions: React.FC<AccountActionsProps> = ({ 
  onSignOut, 
  onDeleteAccount,
  onResetSales 
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const handleDeleteAccount = async () => {
    if (!onDeleteAccount) return;
    
    setIsDeleting(true);
    try {
      await onDeleteAccount();
    } finally {
      setIsDeleting(false);
    }
  };

  const handleResetSales = async () => {
    if (!onResetSales) return;
    
    setIsResetting(true);
    try {
      await onResetSales();
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <Card className="border-0 shadow-md mt-6 overflow-hidden">
      <div className="h-1.5 bg-gradient-to-r from-pink-500 to-red-500"></div>
      <CardHeader>
        <CardTitle className="text-lg">Account Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {onResetSales && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start border-orange-200 hover:bg-orange-50 hover:text-orange-700"
                >
                  <RefreshCw className="mr-2 h-4 w-4 text-orange-500" />
                  Reset Sales Data
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete all your sales data. This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleResetSales}
                    disabled={isResetting}
                    className="bg-orange-600 hover:bg-orange-700"
                  >
                    {isResetting ? "Resetting..." : "Reset Sales"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
          
          {onDeleteAccount && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start border-red-200 hover:bg-red-50 hover:text-red-700"
                >
                  <Trash2 className="mr-2 h-4 w-4 text-red-500" />
                  Delete Account
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle className="flex items-center">
                    <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
                    Delete your account?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete your account and all associated data.
                    This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDeleteAccount}
                    disabled={isDeleting}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    {isDeleting ? "Deleting..." : "Delete Account"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
          
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
