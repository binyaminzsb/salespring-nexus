
import React, { useEffect, useState } from "react";
import AppLayout from "@/components/dashboard/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { fetchSales, filterSalesByPeriod, formatCurrency } from "@/utils/salesUtils";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const Sales = () => {
  const [sales, setSales] = useState<any[]>([]);
  const [period, setPeriod] = useState<"daily" | "weekly" | "monthly" | "yearly">("daily");
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    // Fetch all sales data
    const allSales = fetchSales();
    setSales(allSales);
    
    // Process chart data
    processChartData(allSales);
  }, []);

  // Process sales data for the chart based on the selected period
  const processChartData = (salesData: any[]) => {
    const filtered = filterSalesByPeriod(salesData, period);
    
    // Group by date
    const grouped = filtered.reduce((acc, sale) => {
      const date = new Date(sale.date).toLocaleDateString();
      if (!acc[date]) {
        acc[date] = 0;
      }
      acc[date] += sale.totalAmount;
      return acc;
    }, {});
    
    // Convert to array format for recharts
    const chartData = Object.entries(grouped).map(([date, amount]) => ({
      date,
      amount,
    }));
    
    setChartData(chartData);
  };

  // Filter sales when period changes
  useEffect(() => {
    processChartData(sales);
  }, [period, sales]);

  const filteredSales = filterSalesByPeriod(sales, period);
  const totalAmount = filteredSales.reduce(
    (total, sale) => total + sale.totalAmount,
    0
  );

  return (
    <AppLayout>
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Sales Reports</h1>
          <Tabs
            defaultValue="daily"
            onValueChange={(value) => setPeriod(value as any)}
          >
            <TabsList>
              <TabsTrigger value="daily">Daily</TabsTrigger>
              <TabsTrigger value="weekly">Weekly</TabsTrigger>
              <TabsTrigger value="monthly">Monthly</TabsTrigger>
              <TabsTrigger value="yearly">Yearly</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                Total Sales
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{formatCurrency(totalAmount)}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                Number of Transactions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{filteredSales.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                Average Sale
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {formatCurrency(
                  filteredSales.length > 0
                    ? totalAmount / filteredSales.length
                    : 0
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Sales Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                {chartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis tickFormatter={(value) => `$${value}`} />
                      <Tooltip formatter={(value) => [`$${value}`, "Sales"]} />
                      <Bar dataKey="amount" fill="#3b82f6" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-gray-500">
                    No sales data available for this period
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            {filteredSales.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Transaction ID</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Payment Method</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSales
                    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                    .slice(0, 10)
                    .map((sale) => (
                      <TableRow key={sale.id}>
                        <TableCell className="font-medium">
                          {sale.id.substring(0, 8)}
                        </TableCell>
                        <TableCell>
                          {new Date(sale.date).toLocaleString()}
                        </TableCell>
                        <TableCell>
                          {sale.items.length + (sale.customAmount > 0 ? 1 : 0)}
                        </TableCell>
                        <TableCell>{sale.paymentMethod}</TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(sale.totalAmount)}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No transactions found for this period
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default Sales;
