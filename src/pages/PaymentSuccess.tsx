
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Check, Download, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import AppLayout from "@/components/dashboard/AppLayout";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { downloadReceipt, formatCurrency } from "@/utils/salesUtils";

const PaymentSuccess = () => {
  const { saleId } = useParams<{ saleId: string }>();
  const navigate = useNavigate();
  const [sale, setSale] = useState<any | null>(null);

  useEffect(() => {
    // Fetch the sale details from localStorage
    const salesJson = localStorage.getItem("blank_pos_sales");
    const sales = salesJson ? JSON.parse(salesJson) : [];
    const foundSale = sales.find((s: any) => s.id === saleId);
    
    if (foundSale) {
      setSale(foundSale);
    }
  }, [saleId]);

  const handleDownloadReceipt = () => {
    if (sale) {
      downloadReceipt(sale);
    }
  };

  if (!sale) {
    return (
      <AppLayout>
        <div className="container mx-auto py-8 px-4 text-center">
          <h1 className="text-2xl font-bold mb-4">Sale not found</h1>
          <Button onClick={() => navigate("/dashboard")}>
            Return to Dashboard
          </Button>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="container mx-auto py-8 px-4 max-w-md">
        <Card className="border-green-200 shadow-md">
          <CardHeader className="bg-green-50 border-b border-green-100">
            <div className="flex justify-center mb-4">
              <div className="bg-green-500 rounded-full p-3">
                <Check className="h-8 w-8 text-white" />
              </div>
            </div>
            <CardTitle className="text-center text-2xl">Payment Successful!</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Transaction ID:</span>
                <span className="font-mono">{sale.id.substring(0, 8)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Date:</span>
                <span>{new Date(sale.date).toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Payment Method:</span>
                <span>{sale.paymentMethod}</span>
              </div>
              {sale.cardNumber && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Card:</span>
                  <span>{sale.cardNumber}</span>
                </div>
              )}
              <div className="flex justify-between items-center pt-4 border-t">
                <span className="font-bold">Total Amount:</span>
                <span className="font-bold text-xl">
                  {formatCurrency(sale.totalAmount)}
                </span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <Button 
              className="w-full" 
              onClick={handleDownloadReceipt}
            >
              <Download className="mr-2 h-4 w-4" />
              Download Receipt
            </Button>
            <Button 
              variant="outline" 
              className="w-full" 
              onClick={() => navigate("/new-sale")}
            >
              <ShoppingCart className="mr-2 h-4 w-4" />
              New Sale
            </Button>
          </CardFooter>
        </Card>
      </div>
    </AppLayout>
  );
};

export default PaymentSuccess;
