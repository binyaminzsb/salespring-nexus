
import React from "react";
import AppLayout from "@/components/dashboard/AppLayout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { UserRound, LogOut } from "lucide-react";

const Profile = () => {
  const { user, signOut } = useAuth();

  if (!user) {
    return null;
  }

  const getUserInitials = () => {
    return user.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <AppLayout>
      <div className="container mx-auto py-8 px-4 max-w-2xl">
        <h1 className="text-3xl font-bold mb-8">Profile</h1>

        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center space-x-4">
              <Avatar className="h-20 w-20">
                <AvatarFallback className="bg-pos-blue text-white text-xl">
                  {getUserInitials()}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-2xl">{user.name}</CardTitle>
                <CardDescription>{user.email}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-1">Account Information</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="text-gray-500">User ID</div>
                  <div>{user.id}</div>
                  <div className="text-gray-500">Name</div>
                  <div>{user.name}</div>
                  <div className="text-gray-500">Email</div>
                  <div>{user.email}</div>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button className="w-full" variant="outline">
              <UserRound className="mr-2 h-4 w-4" />
              Edit Profile
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Account Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-500 mb-4">
              Managing your account security and data
            </p>
            <div className="space-y-2">
              <Button
                variant="destructive"
                className="w-full justify-start"
                onClick={signOut}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default Profile;
