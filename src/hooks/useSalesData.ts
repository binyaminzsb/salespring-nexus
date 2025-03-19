
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { fetchSales } from "@/utils/salesFetch";
import { filterSalesByPeriod } from "@/utils/salesFilter";
import { User } from "@/types/auth";

export const useSalesData = (user: User | null) => {
  const [sales, setSales] = useState<any[]>([]);
  const [period, setPeriod] = useState<"daily" | "weekly" | "monthly" | "yearly">("daily");
  const [chartData, setChartData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Function to fetch all sales data (both Supabase and localStorage)
  const fetchAllSales = async () => {
    setIsLoading(true);
    
    // Get local sales from localStorage
    const localSales = fetchSales();
    
    // Filter to only user's sales if logged in
    const userLocalSales = user 
      ? localSales.filter((sale: any) => sale.userId === user.id)
      : localSales;
    
    // If user is logged in, also try to get Supabase transactions
    let supaSales: any[] = [];
    
    if (user) {
      try {
        const { data, error } = await supabase
          .from('sales')
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
        console.error('Error fetching transactions:', error);
      }
    }
    
    // Combine both sources, with Supabase data taking precedence
    const combinedSales = [...userLocalSales, ...supaSales];
    
    // Remove duplicates based on id
    const uniqueSales = combinedSales.filter((sale, index, self) =>
      index === self.findIndex((s) => s.id === sale.id)
    );
    
    setSales(uniqueSales);
    processChartData(uniqueSales);
    setIsLoading(false);
  };

  // Process sales data for the chart based on the selected period
  const processChartData = (salesData: any[]) => {
    const filtered = filterSalesByPeriod(salesData, period);
    
    // Group by date
    const grouped = filtered.reduce((acc, sale) => {
      const date = new Date(sale.date || sale.created_at).toLocaleDateString();
      if (!acc[date]) {
        acc[date] = 0;
      }
      acc[date] += sale.totalAmount || parseFloat(sale.total?.toString() || "0") || 0;
      return acc;
    }, {} as Record<string, number>);
    
    // Convert to array format for recharts
    const chartData = Object.entries(grouped).map(([date, amount]) => ({
      date,
      amount,
    }));
    
    setChartData(chartData);
  };

  useEffect(() => {
    // Fetch both local and Supabase sales data
    fetchAllSales();
  }, [user]);
  
  // Filter sales when period changes
  useEffect(() => {
    processChartData(sales);
  }, [period, sales]);

  const filteredSales = filterSalesByPeriod(sales, period);
  const totalAmount = filteredSales.reduce(
    (total, sale) => total + (sale.totalAmount || parseFloat(sale.total ? sale.total.toString() : "0") || 0),
    0
  );

  return {
    sales,
    filteredSales,
    chartData,
    period,
    setPeriod,
    isLoading,
    totalAmount
  };
};
