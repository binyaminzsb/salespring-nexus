
import React from "react";
import AppLayout from "@/components/dashboard/AppLayout";
import { useAuth } from "@/contexts/AuthContext";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileAvatar } from "@/components/profile/ProfileAvatar";
import { AccountActions } from "@/components/profile/AccountActions";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { useProfileForm } from "@/hooks/useProfileForm";

const Profile = () => {
  const { user, signOut } = useAuth();
  const {
    name,
    setName,
    username,
    setUsername,
    isEditing,
    isLoading,
    currentPassword,
    setCurrentPassword,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    isChangingPassword,
    setIsChangingPassword,
    handleEditProfile,
    handleCancelEdit,
    handleSaveChanges,
    handleChangePassword
  } = useProfileForm(user);

  if (!user) {
    return null;
  }

  return (
    <AppLayout>
      <div className="container mx-auto py-10 px-4 max-w-3xl">
        <ProfileHeader title="My Profile" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <ProfileAvatar 
              user={user} 
              isEditing={isEditing} 
              onEditProfile={handleEditProfile} 
            />
            <AccountActions onSignOut={signOut} />
          </div>

          <div className="md:col-span-2">
            <ProfileForm
              user={user}
              name={name}
              username={username}
              isEditing={isEditing}
              isLoading={isLoading}
              isChangingPassword={isChangingPassword}
              currentPassword={currentPassword}
              newPassword={newPassword}
              confirmPassword={confirmPassword}
              setName={setName}
              setUsername={setUsername}
              setCurrentPassword={setCurrentPassword}
              setNewPassword={setNewPassword}
              setConfirmPassword={setConfirmPassword}
              setIsChangingPassword={setIsChangingPassword}
              handleCancelEdit={handleCancelEdit}
              handleSaveChanges={handleSaveChanges}
              handleChangePassword={handleChangePassword}
            />
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Profile;
