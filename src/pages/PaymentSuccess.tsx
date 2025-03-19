
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Check, ArrowLeft, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import AppLayout from "@/components/dashboard/AppLayout";
import { fetchSales } from "@/utils/salesFetch";
import { formatCurrency } from "@/utils/salesUtils";
import { generatePDF } from "@/utils/receiptGenerator";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

const PaymentSuccess = () => {
  const { saleId } = useParams<{ saleId: string }>();
  const { user } = useAuth();
  const [sale, setSale] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSaleData = async () => {
      if (!saleId) return;
      
      try {
        if (saleId.startsWith("local-")) {
          // Fetch from localStorage
          const localSales = fetchSales();
          const localSale = localSales.find((s: any) => s.id === saleId);
          
          if (localSale) {
            setSale(localSale);
          }
        } else {
          // Fetch from Supabase
          const { data, error } = await supabase
            .from('sales')
            .select('*')
            .eq('id', saleId)
            .single();
          
          if (error) {
            console.error("Error fetching transaction:", error);
          } else if (data) {
            // Format sale data
            const formattedSale = {
              id: data.id,
              date: data.created_at,
              totalAmount: parseFloat(data.total.toString()),
              paymentMethod: data.payment_method,
              items: [] // We don't have items in the sales table
            };
            
            setSale(formattedSale);
          }
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSaleData();
  }, [saleId]);

  const handleDownloadReceipt = () => {
    if (sale) {
      generatePDF(sale);
    }
  };

  return (
    <AppLayout>
      <div className="container max-w-lg mx-auto py-8 px-4">
        <Card className="border-green-100 shadow-md overflow-hidden">
          <div className="bg-green-50 text-center p-6">
            <div className="mx-auto w-16 h-16 bg-green-600 text-white rounded-full flex items-center justify-center mb-4">
              <Check className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-bold text-green-800">Payment Successful!</h1>
            <p className="text-green-700 mt-2">Your transaction has been processed.</p>
          </div>
          
          <CardContent className="p-6">
            {isLoading ? (
              <div className="text-center p-4">Loading transaction details...</div>
            ) : sale ? (
              <div className="space-y-4">
                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-500">Transaction ID:</span>
                  <span className="font-medium">{sale.id.substring(0, 8)}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-500">Date:</span>
                  <span className="font-medium">
                    {new Date(sale.date).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-500">Payment Method:</span>
                  <span className="font-medium capitalize">{sale.paymentMethod}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-500">Total Amount:</span>
                  <span className="font-bold text-lg">{formatCurrency(sale.totalAmount)}</span>
                </div>
              </div>
            ) : (
              <div className="text-center p-4 text-red-600">
                Transaction not found. Please contact support.
              </div>
            )}
          </CardContent>
          
          <CardFooter className="flex flex-col gap-4 p-6 bg-gray-50">
            <Button 
              variant="outline" 
              className="w-full flex gap-2 items-center justify-center"
              onClick={handleDownloadReceipt}
              disabled={!sale}
            >
              <Download className="w-4 h-4" />
              Download Receipt
            </Button>
            <Link to="/new-sale" className="w-full">
              <Button 
                className="w-full flex gap-2 items-center justify-center bg-blue-600 hover:bg-blue-700"
              >
                <ArrowLeft className="w-4 h-4" />
                New Sale
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </AppLayout>
  );
};

export default PaymentSuccess;
