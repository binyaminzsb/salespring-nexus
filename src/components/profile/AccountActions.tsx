
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LogOut, Trash, RotateCcw, AlertTriangle } from "lucide-react";
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
import { SALES_KEY } from "@/utils/cartUtils";
import { toast } from "sonner";

interface AccountActionsProps {
  onSignOut: () => void;
  onDeleteAccount: () => Promise<boolean>;
}

export const AccountActions: React.FC<AccountActionsProps> = ({ 
  onSignOut, 
  onDeleteAccount 
}) => {
  const [isResetting, setIsResetting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleResetSales = () => {
    try {
      setIsResetting(true);
      // Clear the sales data from localStorage
      localStorage.removeItem(SALES_KEY);
      // Show success message
      toast.success("Sales data has been reset successfully");
      // Reload the page to reflect changes
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error("Failed to reset sales:", error);
      toast.error("Failed to reset sales data");
    } finally {
      setIsResetting(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      setIsDeleting(true);
      const success = await onDeleteAccount();
      if (!success) {
        setIsDeleting(false);
        toast.error("Failed to delete account");
      }
    } catch (error) {
      console.error("Failed to delete account:", error);
      setIsDeleting(false);
      toast.error("Failed to delete account");
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
          <Button
            variant="destructive"
            className="w-full justify-start"
            onClick={onSignOut}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start border-yellow-500 text-yellow-700 hover:bg-yellow-50"
              >
                <RotateCcw className="mr-2 h-4 w-4" />
                Reset Sales Data
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Reset Sales Data</AlertDialogTitle>
                <AlertDialogDescription>
                  This will delete all your local sales history. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleResetSales}
                  disabled={isResetting}
                  className="bg-yellow-600 hover:bg-yellow-700"
                >
                  {isResetting ? "Resetting..." : "Reset Sales"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start border-red-500 text-red-700 hover:bg-red-50"
              >
                <Trash className="mr-2 h-4 w-4" />
                Delete Account
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle className="flex items-center gap-2 text-red-600">
                  <AlertTriangle className="h-5 w-5" />
                  Delete Your Account
                </AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete your account and all your data. This action cannot be undone.
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
        </div>
      </CardContent>
    </Card>
  );
};
