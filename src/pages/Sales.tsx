
import React from "react";
import AppLayout from "@/components/dashboard/AppLayout";
import { useAuth } from "@/contexts/AuthContext";
import { useSalesData } from "@/hooks/useSalesData";
import { SalesMetrics } from "@/components/sales/SalesMetrics";
import { SalesChart } from "@/components/sales/SalesChart";
import { SalesTable } from "@/components/sales/SalesTable";
import { SalesPeriodSelector } from "@/components/sales/SalesPeriodSelector";

const Sales = () => {
  const { user } = useAuth();
  const { 
    filteredSales, 
    chartData, 
    period, 
    setPeriod, 
    isLoading, 
    totalAmount 
  } = useSalesData(user);

  return (
    <AppLayout>
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Sales Reports</h1>
          <SalesPeriodSelector 
            period={period} 
            onPeriodChange={(value) => setPeriod(value)} 
          />
        </div>

        <SalesMetrics 
          totalAmount={totalAmount} 
          transactionCount={filteredSales.length} 
        />

        <div className="grid grid-cols-1 gap-6 mb-8">
          <SalesChart 
            chartData={chartData} 
            isLoading={isLoading} 
          />
        </div>

        <SalesTable filteredSales={filteredSales} />
      </div>
    </AppLayout>
  );
};

export default Sales;
