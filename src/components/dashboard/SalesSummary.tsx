
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { formatCurrency, fetchSales, filterSalesByPeriod } from "@/utils/salesUtils";

const SalesSummary: React.FC = () => {
  const { user } = useAuth();
  const [salesData, setSalesData] = useState<any[]>([]);
  const [period, setPeriod] = useState<"daily" | "weekly" | "monthly" | "yearly">("daily");
  const [chartData, setChartData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Function to fetch all sales data (both Supabase and localStorage)
  const fetchAllSalesData = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      // Get local sales from localStorage
      const localSales = fetchSales();
      
      // Filter to only user's sales if logged in
      const userLocalSales = user 
        ? localSales.filter((sale: any) => sale.userId === user.id)
        : localSales;
      
      // If user is logged in, also try to get Supabase transactions
      let supaSales: any[] = [];
      
      try {
        const { data, error } = await supabase
          .from('pos_transactions')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
          
        if (!error && data) {
          // Convert Supabase transaction format to match local sales format
          supaSales = data.map(transaction => ({
            id: transaction.id,
            totalAmount: parseFloat(transaction.total.toString()),
            paymentMethod: transaction.payment_method,
            date: transaction.created_at,
            userId: transaction.user_id,
            items: []  // We don't have items in the transaction table
          }));
        }
      } catch (error) {
        console.error('Error fetching Supabase transactions:', error);
        // Continue with local data only
      }
      
      // Combine both sources, with Supabase data taking precedence
      const combinedSales = [...userLocalSales, ...supaSales];
      
      // Remove duplicates based on id
      const uniqueSales = combinedSales.filter((sale, index, self) =>
        index === self.findIndex((s) => s.id === sale.id)
      );
      
      setSalesData(uniqueSales);
      processChartData(uniqueSales);
    } catch (error) {
      console.error('Error fetching all sales data:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Group transactions by day
  const processChartData = (transactions: any[]) => {
    const filteredSales = filterSalesByPeriod(transactions, period);
    
    // Group by date
    const grouped = filteredSales.reduce((acc, sale) => {
      const date = new Date(sale.date || sale.created_at).toLocaleDateString();
      
      if (!acc[date]) {
        acc[date] = {
          date,
          total: 0,
          count: 0
        };
      }
      
      const amount = sale.totalAmount || parseFloat(sale.total ? sale.total.toString() : "0") || 0;
      acc[date].total += amount;
      acc[date].count += 1;
      
      return acc;
    }, {});
    
    return Object.values(grouped);
  };
  
  // Calculate total sales based on period
  const calculateTotalSales = () => {
    if (!salesData.length) return 0;
    
    const filteredSales = filterSalesByPeriod(salesData, period);
    
    return filteredSales.reduce((sum, sale) => {
      const amount = sale.totalAmount || parseFloat(sale.total ? sale.total.toString() : "0") || 0;
      return sum + amount;
    }, 0);
  };

  useEffect(() => {
    if (user) {
      fetchAllSalesData();
    }
  }, [user]);
  
  useEffect(() => {
    if (salesData.length > 0) {
      setChartData(processChartData(salesData));
    }
  }, [period, salesData]);
  
  const totalSales = calculateTotalSales();
  const saleCount = salesData.length;

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Sales Summary</CardTitle>
          <Tabs defaultValue="daily" onValueChange={(value) => setPeriod(value as any)}>
            <TabsList>
              <TabsTrigger value="daily">Daily</TabsTrigger>
              <TabsTrigger value="weekly">Weekly</TabsTrigger>
              <TabsTrigger value="monthly">Monthly</TabsTrigger>
              <TabsTrigger value="yearly">Yearly</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 mb-6 md:grid-cols-2">
          <div className="flex justify-between items-center p-4 bg-slate-50 rounded-lg">
            <div className="text-sm font-medium text-gray-500">Total Sales</div>
            <div className="text-2xl font-bold">{formatCurrency(totalSales)}</div>
          </div>
          <div className="flex justify-between items-center p-4 bg-slate-50 rounded-lg">
            <div className="text-sm font-medium text-gray-500">Transactions</div>
            <div className="text-2xl font-bold">{saleCount}</div>
          </div>
        </div>
        
        <div className="h-64">
          {isLoading ? (
            <div className="h-full flex items-center justify-center text-gray-500">
              Loading sales data...
            </div>
          ) : chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis tickFormatter={(value) => `$${value}`} />
                <Tooltip formatter={(value) => [`$${value}`, "Sales"]} />
                <Bar dataKey="total" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-500">
              No sales data available
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SalesSummary;
