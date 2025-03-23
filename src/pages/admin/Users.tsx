
import React, { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

interface User {
  id: string;
  email: string;
  created_at: string;
}

interface AuthUser {
  id: string;
  email?: string;
  created_at?: string;
}

interface ProfileData {
  id: string;
  email: string;
}

const Users = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        console.log("Fetching users from Supabase...");
        
        // First get the user's session to check if authenticated
        const { data: sessionData } = await supabase.auth.getSession();
        
        if (!sessionData.session) {
          console.log("No authenticated session found");
          throw new Error("Authentication required");
        }

        // Direct auth API request to get users
        // For admin views, we'll try to fetch users from auth.users via profiles
        const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
        
        // Log the result of the auth API attempt
        console.log("Auth API attempt:", authUsers, authError);
        
        // If auth admin API access fails, try profiles table
        const { data: profilesData, error: profilesError } = await supabase
          .from('profiles')
          .select('id, email');
        
        console.log("Profiles query result:", profilesData, profilesError);

        if (profilesError) {
          console.error("Error fetching profiles:", profilesError);
        }
        
        if (profilesData && profilesData.length > 0) {
          console.log("Found user profiles:", profilesData);
          
          // Map the profiles data to user format with created_at field
          const usersWithDates = (profilesData as ProfileData[]).map((profile) => ({
            id: profile.id,
            email: profile.email,
            created_at: new Date().toISOString() // Default date since profiles might not have created_at
          }));
          
          setUsers(usersWithDates);
          toast.success(`Found ${usersWithDates.length} users in the database`);
        } else {
          // If no data from profiles table, try auth.users via a direct query
          // Note: This might not work due to permissions but worth trying
          const { data: authUsersData, error: directAuthError } = await supabase
            .rpc('get_auth_users');
            
          console.log("Direct auth users query:", authUsersData, directAuthError);
          
          if (authUsersData && Array.isArray(authUsersData) && authUsersData.length > 0) {
            const typedAuthUsers = authUsersData as any[];
            setUsers(typedAuthUsers as User[]);
            toast.success(`Found ${typedAuthUsers.length} users via auth API`);
          } else {
            // Last resort - see if we can match any user IDs from the session
            console.log("No users found in profiles table or auth API, using session user");
            
            if (sessionData.session?.user) {
              const sessionUser = {
                id: sessionData.session.user.id,
                email: sessionData.session.user.email || 'unknown@example.com',
                created_at: new Date().toISOString()
              };
              
              setUsers([sessionUser]);
              toast.info("Displaying only the currently logged-in user.");
            } else {
              console.log("No users found in profiles table, using demo data");
              // If no profiles are found, use demo data
              const demoUsers = [
                {
                  id: "4ed9bf3c-8426-4bcf-8b8a-4735cc1a1d19",
                  email: "sirosh@gmail.com",
                  created_at: new Date().toISOString(),
                },
                {
                  id: "0acb4202-de2a-43c4-b3c1-4b6ec85b7e93",
                  email: "binyamin@gmail.com",
                  created_at: new Date(Date.now() - 86400000).toISOString(),
                },
                {
                  id: "2d1ac16c-140d-4203-90ad-be7a4752892",
                  email: "muhammad@gmail.com",
                  created_at: new Date(Date.now() - 172800000).toISOString(),
                },
              ];
              
              setUsers(demoUsers);
              toast.info("Using demo data since no users were found in the database.");
            }
          }
        }
      } catch (err: any) {
        console.error("Error in fetchUsers:", err);
        setError(err.message || "Failed to fetch users");
        
        // Fallback to demo data if API access fails
        setUsers([
          {
            id: "4ed9bf3c-8426-4bcf-8b8a-4735cc1a1d19",
            email: "sirosh@gmail.com",
            created_at: new Date().toISOString(),
          },
          {
            id: "0acb4202-de2a-43c4-b3c1-4b6ec85b7e93",
            email: "binyamin@gmail.com", 
            created_at: new Date(Date.now() - 86400000).toISOString(),
          },
          {
            id: "2d1ac16c-140d-4203-90ad-be7a4752892",
            email: "muhammad@gmail.com",
            created_at: new Date(Date.now() - 172800000).toISOString(),
          },
        ]);
        
        toast.error(`Error fetching users: ${err.message || "Unknown error"}`);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) {
    return (
      <AdminLayout>
        <div className="container mx-auto py-8 px-4 flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-pos-purple" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="container mx-auto py-8 px-4">
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Registered Users</CardTitle>
          </CardHeader>
          <CardContent>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Registration Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.length > 0 ? (
                  users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.email}</TableCell>
                      <TableCell>
                        {format(new Date(user.created_at), "dd MMM yyyy, h:mm a")}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={2} className="text-center py-4">
                      No users found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default Users;
