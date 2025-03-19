import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/utils/salesFormat";

interface SalesMetricsProps {
  totalAmount: number;
  transactionCount: number;
}

export const SalesMetrics: React.FC<SalesMetricsProps> = ({ totalAmount, transactionCount }) => {
  return (
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
          <div className="text-3xl font-bold">{transactionCount}</div>
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
              transactionCount > 0
                ? totalAmount / transactionCount
                : 0
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
