
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

const Users = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        console.log("Fetching users from profiles table...");
        const { data, error } = await supabase
          .from('profiles')
          .select('id, email');
        
        if (error) {
          throw error;
        }
        
        console.log("Profiles data received:", data);
        
        if (data && data.length > 0) {
          // Map the profiles data to user format
          const usersWithDates = data.map((profile: any) => ({
            id: profile.id,
            email: profile.email,
            created_at: new Date().toISOString() // Default to current date
          }));
          
          setUsers(usersWithDates);
        } else {
          console.log("No profiles found in database, using demo data");
          // If no profiles are found, use demo data
          setUsers([
            {
              id: "1",
              email: "demo@example.com",
              created_at: new Date().toISOString(),
            },
            {
              id: "2",
              email: "user@example.com",
              created_at: new Date(Date.now() - 86400000).toISOString(),
            },
          ]);
          
          toast.info("Using demo data since no users are in the database yet.");
        }
      } catch (err: any) {
        console.error("Error fetching users:", err);
        setError(err.message || "Failed to fetch users");
        
        // Fallback to demo data if API access fails
        setUsers([
          {
            id: "1",
            email: "demo@example.com",
            created_at: new Date().toISOString(),
          },
          {
            id: "2",
            email: "user@example.com",
            created_at: new Date(Date.now() - 86400000).toISOString(),
          },
        ]);
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
