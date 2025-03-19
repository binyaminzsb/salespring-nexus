
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface SalesPeriodSelectorProps {
  period: "daily" | "weekly" | "monthly" | "yearly";
  onPeriodChange: (value: "daily" | "weekly" | "monthly" | "yearly") => void;
}

export const SalesPeriodSelector: React.FC<SalesPeriodSelectorProps> = ({ 
  period, 
  onPeriodChange 
}) => {
  return (
    <Tabs
      value={period}
      onValueChange={(value) => onPeriodChange(value as any)}
    >
      <TabsList>
        <TabsTrigger value="daily">Daily</TabsTrigger>
        <TabsTrigger value="weekly">Weekly</TabsTrigger>
        <TabsTrigger value="monthly">Monthly</TabsTrigger>
        <TabsTrigger value="yearly">Yearly</TabsTrigger>
      </TabsList>
    </Tabs>
  );
};
