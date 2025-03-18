
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { fetchSales, calculateTotalSales, formatCurrency, groupSalesByDay } from "@/utils/salesUtils";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const SalesSummary: React.FC = () => {
  const [salesData, setSalesData] = useState<any[]>([]);
  const [period, setPeriod] = useState<"daily" | "weekly" | "monthly" | "yearly">("daily");
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    // Fetch sales data from localStorage
    const sales = fetchSales();
    setSalesData(sales);
    
    // Generate chart data
    setChartData(groupSalesByDay(sales));
  }, []);

  const totalSales = calculateTotalSales(salesData, period);
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
          {chartData.length > 0 ? (
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
