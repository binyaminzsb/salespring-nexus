import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { formatCurrency } from "@/utils/salesUtils";

const SalesSummary: React.FC = () => {
  const { user } = useAuth();
  const [salesData, setSalesData] = useState<any[]>([]);
  const [period, setPeriod] = useState<"daily" | "weekly" | "monthly" | "yearly">("daily");
  const [chartData, setChartData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Function to fetch user-specific transactions
  const fetchUserTransactions = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('pos_transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
        
      if (error) {
        console.error('Error fetching transactions:', error);
        return;
      }
      
      if (data && data.length > 0) {
        setSalesData(data);
        // Generate chart data
        setChartData(groupTransactionsByDay(data));
      } else {
        // Try to get sales from localStorage as fallback
        const salesJson = localStorage.getItem("blank_pos_sales");
        if (salesJson) {
          const localSales = JSON.parse(salesJson);
          const userSales = localSales.filter((sale: any) => sale.userId === user.id);
          setSalesData(userSales);
          setChartData(groupTransactionsByDay(userSales));
        }
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Group transactions by day
  const groupTransactionsByDay = (transactions: any[]) => {
    const grouped = transactions.reduce((acc, transaction) => {
      const date = new Date(transaction.created_at || transaction.date).toLocaleDateString();
      
      if (!acc[date]) {
        acc[date] = {
          date,
          total: 0,
          count: 0
        };
      }
      
      const amount = transaction.total || transaction.totalAmount || 0;
      acc[date].total += parseFloat(amount);
      acc[date].count += 1;
      
      return acc;
    }, {});
    
    return Object.values(grouped);
  };
  
  // Calculate total sales based on period
  const calculateTotalSales = () => {
    if (!salesData.length) return 0;
    
    const now = new Date();
    let periodStart = new Date();
    
    switch (period) {
      case 'daily':
        periodStart.setDate(now.getDate() - 1);
        break;
      case 'weekly':
        periodStart.setDate(now.getDate() - 7);
        break;
      case 'monthly':
        periodStart.setMonth(now.getMonth() - 1);
        break;
      case 'yearly':
        periodStart.setFullYear(now.getFullYear() - 1);
        break;
    }
    
    const filteredSales = salesData.filter(sale => {
      const saleDate = new Date(sale.created_at || sale.date);
      return saleDate >= periodStart && saleDate <= now;
    });
    
    return filteredSales.reduce((sum, sale) => {
      return sum + parseFloat(sale.total || sale.totalAmount || 0);
    }, 0);
  };

  useEffect(() => {
    if (user) {
      fetchUserTransactions();
    }
  }, [user]);
  
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
