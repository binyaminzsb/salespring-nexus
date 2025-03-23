
import React from "react";
import AppLayout from "@/components/dashboard/AppLayout";
import { useAuth } from "@/contexts/AuthContext";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileAvatar } from "@/components/profile/ProfileAvatar";
import { AccountActions } from "@/components/profile/AccountActions";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { useProfileForm } from "@/hooks/useProfileForm";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";

const LoadingState = () => (
  <div className="container mx-auto py-10 px-4 max-w-3xl">
    <h1 className="text-2xl font-bold mb-6">Loading Profile</h1>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div className="md:col-span-1">
        <Skeleton className="h-40 w-40 rounded-full mx-auto" />
        <div className="mt-4 space-y-2">
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
      <div className="md:col-span-2">
        <Skeleton className="h-64 w-full rounded-lg" />
        <div className="mt-4">
          <Progress value={75} className="h-2 w-full" />
        </div>
      </div>
    </div>
  </div>
);

const Profile = () => {
  const { user, loading: authLoading, signOut, deleteAccount } = useAuth();
  const {
    isLoading,
    currentPassword,
    setCurrentPassword,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    isChangingPassword,
    setIsChangingPassword,
    handleChangePassword
  } = useProfileForm(user);

  // Show loading state while auth is loading or we're waiting for user data
  if (authLoading || !user) {
    return (
      <AppLayout>
        <LoadingState />
      </AppLayout>
    );
  }

  // Create a wrapper for deleteAccount to match the expected type
  const handleDeleteAccount = async (): Promise<boolean> => {
    try {
      return await deleteAccount();
    } catch (error) {
      console.error("Failed to delete account:", error);
      return false;
    }
  };

  return (
    <AppLayout>
      <div className="container mx-auto py-10 px-4 max-w-3xl">
        <ProfileHeader title="My Profile" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <ProfileAvatar user={user} />
            <AccountActions onSignOut={signOut} onDeleteAccount={handleDeleteAccount} />
          </div>

          <div className="md:col-span-2">
            <ProfileForm
              user={user}
              isLoading={isLoading}
              isChangingPassword={isChangingPassword}
              currentPassword={currentPassword}
              newPassword={newPassword}
              confirmPassword={confirmPassword}
              setCurrentPassword={setCurrentPassword}
              setNewPassword={setNewPassword}
              setConfirmPassword={setConfirmPassword}
              setIsChangingPassword={setIsChangingPassword}
              handleChangePassword={handleChangePassword}
            />
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Profile;
