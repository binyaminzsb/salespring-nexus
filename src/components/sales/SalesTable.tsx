import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency } from "@/utils/salesFormat";

interface SalesTableProps {
  filteredSales: any[];
}

export const SalesTable: React.FC<SalesTableProps> = ({ filteredSales }) => {
  return (
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
                <TableHead>Payment Method</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSales
                .sort((a, b) => {
                  const dateA = new Date(a.date || a.created_at);
                  const dateB = new Date(b.date || b.created_at);
                  return dateB.getTime() - dateA.getTime();
                })
                .slice(0, 10)
                .map((sale) => (
                  <TableRow key={sale.id}>
                    <TableCell className="font-medium">
                      {sale.id}
                    </TableCell>
                    <TableCell>
                      {new Date(sale.date || sale.created_at).toLocaleString()}
                    </TableCell>
                    <TableCell>{sale.paymentMethod || sale.payment_method}</TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(sale.totalAmount || parseFloat(sale.total ? sale.total.toString() : "0"))}
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
  );
};
