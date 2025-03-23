
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

interface UserSale {
  email: string;
  totalSales: number;
  userId: string;
}

const Sales = () => {
  const [userSales, setUserSales] = useState<UserSale[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        console.log("Fetching sales data and user profiles...");
        
        // First get the user's session to check if authenticated
        const { data: sessionData } = await supabase.auth.getSession();
        
        if (!sessionData.session) {
          console.log("No authenticated session found");
          throw new Error("Authentication required");
        }
        
        // Fetch sales data with join to profiles
        const { data: salesData, error: salesError } = await supabase
          .from('sales')
          .select('user_id, total');
          
        if (salesError) {
          console.error("Error fetching sales:", salesError);
          throw salesError;
        }
        
        console.log("Sales data received:", salesData);
        
        // Fetch user emails
        const { data: profilesData, error: profilesError } = await supabase
          .from('profiles')
          .select('id, email');
          
        if (profilesError) {
          console.error("Error fetching profiles:", profilesError);
          throw profilesError;
        }
        
        console.log("Profiles data received:", profilesData);
        
        if (salesData && salesData.length > 0 && profilesData && profilesData.length > 0) {
          // Map user IDs to emails
          const emailMap = new Map();
          profilesData.forEach((profile: any) => {
            emailMap.set(profile.id, profile.email);
          });
          
          // Group and sum sales by user
          const salesByUser: Record<string, number> = {};
          salesData.forEach((sale: any) => {
            const userId = sale.user_id;
            if (!salesByUser[userId]) {
              salesByUser[userId] = 0;
            }
            salesByUser[userId] += parseFloat(sale.total.toString());
          });
          
          // Format the data for display
          const formattedData = Object.entries(salesByUser).map(([userId, total]) => ({
            userId,
            email: emailMap.get(userId) || 'Unknown User',
            totalSales: total
          }));
          
          setUserSales(formattedData);
          
          if (formattedData.length > 0) {
            toast.success(`Found sales data for ${formattedData.length} users`);
          }
        } else {
          console.log("No sales data or profiles found in database, using demo data");
          // If no data is found, use demo data
          const demoSales = [
            { userId: "1", email: "demo@example.com", totalSales: 1250.75 },
            { userId: "2", email: "user@example.com", totalSales: 876.50 }
          ];
          
          setUserSales(demoSales);
          toast.info("Using demo sales data since no sales were found in the database.");
        }
      } catch (err: any) {
        console.error("Error fetching sales data:", err);
        setError(err.message || "Failed to fetch sales data");
        
        // Fallback to demo data
        setUserSales([
          { userId: "1", email: "demo@example.com", totalSales: 1250.75 },
          { userId: "2", email: "user@example.com", totalSales: 876.50 }
        ]);
        
        toast.error(`Error fetching sales data: ${err.message || "Unknown error"}`);
      } finally {
        setLoading(false);
      }
    };

    fetchSalesData();
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
            <CardTitle>User Sales Report</CardTitle>
          </CardHeader>
          <CardContent>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead className="text-right">Total Sales (£)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {userSales.length > 0 ? (
                  userSales.map((userSale) => (
                    <TableRow key={userSale.userId}>
                      <TableCell className="font-medium">{userSale.email}</TableCell>
                      <TableCell className="text-right">
                        {userSale.totalSales.toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={2} className="text-center py-4">
                      No sales data available
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

export default Sales;
