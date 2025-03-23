
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
        // Fetch sales data
        const { data: salesData, error: salesError } = await supabase
          .from('sales')
          .select('user_id, total');
          
        if (salesError) throw salesError;
        
        // Fetch user emails
        const { data: profilesData, error: profilesError } = await supabase
          .from('profiles')
          .select('id, email');
          
        if (profilesError) throw profilesError;
        
        // Map user IDs to emails
        const emailMap = new Map();
        profilesData.forEach((profile: any) => {
          emailMap.set(profile.id, profile.email);
        });
        
        // Group and sum sales by user
        const salesByUser = salesData.reduce((acc: Record<string, number>, sale: any) => {
          const userId = sale.user_id;
          if (!acc[userId]) {
            acc[userId] = 0;
          }
          acc[userId] += parseFloat(sale.total);
          return acc;
        }, {});
        
        // Format the data for display
        const formattedData = Object.entries(salesByUser).map(([userId, total]) => ({
          userId,
          email: emailMap.get(userId) || 'Unknown User',
          totalSales: total
        }));
        
        setUserSales(formattedData);
      } catch (err: any) {
        console.error("Error fetching sales data:", err);
        setError(err.message || "Failed to fetch sales data");
        
        // Fallback to demo data
        setUserSales([
          { userId: "1", email: "demo@example.com", totalSales: 1250.75 },
          { userId: "2", email: "user@example.com", totalSales: 876.50 }
        ]);
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
