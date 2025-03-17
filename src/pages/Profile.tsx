
import React from "react";
import AppLayout from "@/components/dashboard/AppLayout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { UserRound, LogOut, Mail, CreditCard, Calendar, Shield } from "lucide-react";

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
      <div className="container mx-auto py-10 px-4 max-w-3xl">
        <h1 className="text-4xl font-bold logo-text mb-10">My Profile</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <Card className="border-0 shadow-md text-center overflow-hidden">
              <div className="h-1.5 bg-gradient-to-r from-indigo-500 to-purple-500"></div>
              <CardContent className="p-6">
                <div className="flex justify-center mb-4">
                  <Avatar className="h-28 w-28">
                    <AvatarFallback className="bg-gradient-to-r from-pos-purple to-pos-pink text-white text-3xl">
                      {getUserInitials()}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <h2 className="text-xl font-semibold">{user.name}</h2>
                <p className="text-gray-500">{user.email}</p>
                <div className="mt-6">
                  <Button className="w-full button-gradient" variant="default">
                    <UserRound className="mr-2 h-4 w-4" />
                    Edit Profile
                  </Button>
                </div>
              </CardContent>
            </Card>

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
                    onClick={signOut}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="md:col-span-2">
            <Card className="border-0 shadow-md overflow-hidden">
              <div className="h-1.5 bg-gradient-to-r from-purple-500 to-indigo-500"></div>
              <CardHeader>
                <CardTitle className="text-xl">Account Information</CardTitle>
                <CardDescription>Your personal details and preferences</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex items-center text-gray-700">
                      <UserRound className="h-4 w-4 mr-2 text-indigo-600" />
                      <span className="font-medium">Personal Details</span>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                      <div className="grid grid-cols-3 text-sm">
                        <div className="text-gray-500">Full Name</div>
                        <div className="col-span-2 font-medium">{user.name}</div>
                      </div>
                      <div className="grid grid-cols-3 text-sm">
                        <div className="text-gray-500">User ID</div>
                        <div className="col-span-2 font-medium">{user.id}</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center text-gray-700">
                      <Mail className="h-4 w-4 mr-2 text-purple-600" />
                      <span className="font-medium">Contact Information</span>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                      <div className="grid grid-cols-3 text-sm">
                        <div className="text-gray-500">Email</div>
                        <div className="col-span-2 font-medium">{user.email}</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center text-gray-700">
                      <Shield className="h-4 w-4 mr-2 text-pink-600" />
                      <span className="font-medium">Security Settings</span>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                      <div className="grid grid-cols-3 text-sm">
                        <div className="text-gray-500">Password</div>
                        <div className="col-span-2 font-medium">••••••••</div>
                      </div>
                      <div className="grid grid-cols-3 text-sm">
                        <div className="text-gray-500">Last Updated</div>
                        <div className="col-span-2 font-medium">2 months ago</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between flex-wrap gap-2">
                <Button variant="outline" className="flex-1">
                  Cancel
                </Button>
                <Button className="button-gradient flex-1">
                  Save Changes
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Profile;
