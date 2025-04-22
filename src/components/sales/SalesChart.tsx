
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { formatCurrency } from "@/utils/salesFormat";

interface SalesChartProps {
  chartData: any[];
  isLoading: boolean;
}

export const SalesChart: React.FC<SalesChartProps> = ({ chartData, isLoading }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Sales Over Time</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          {isLoading ? (
            <div className="h-full flex items-center justify-center text-gray-500">
              Loading sales data...
            </div>
          ) : chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis tickFormatter={(value) => formatCurrency(value)} />
                <Tooltip formatter={(value) => [formatCurrency(value as number), "Sales"]} />
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
  );
};

