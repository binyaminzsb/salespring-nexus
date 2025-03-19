import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Check, Download, ShoppingCart, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import AppLayout from "@/components/dashboard/AppLayout";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { downloadReceipt, formatCurrency } from "@/utils/salesUtils";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const PaymentSuccess = () => {
  const { saleId } = useParams<{ saleId: string }>();
  const navigate = useNavigate();
  const [sale, setSale] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSaleDetails = async () => {
      setLoading(true);
      
      try {
        // First try to get from Supabase
        if (saleId && saleId.length > 10) { // Real Supabase UUID is longer than demo IDs
          const { data, error } = await supabase
            .from('sales')
            .select('*')
            .eq('id', saleId)
            .single();
            
          if (!error && data) {
            // Convert to local sale format
            setSale({
              id: data.id,
              totalAmount: parseFloat(data.total.toString()),
              paymentMethod: data.payment_method,
              date: data.created_at,
              items: [], // We don't have items in the transaction table
            });
            
            setLoading(false);
            
            // Auto-download PDF receipt after 1 second
            const timer = setTimeout(() => {
              downloadPdfReceipt({
                id: data.id,
                totalAmount: parseFloat(data.total.toString()),
                paymentMethod: data.payment_method,
                date: data.created_at,
                items: [], 
              });
            }, 1000);
            
            return () => clearTimeout(timer);
          }
        }
        
        // If not found in Supabase or it's a demo ID, try localStorage
        const salesJson = localStorage.getItem("blank_pos_sales");
        const sales = salesJson ? JSON.parse(salesJson) : [];
        const foundSale = sales.find((s: any) => s.id === saleId);
        
        if (foundSale) {
          setSale(foundSale);
          
          // Auto-download PDF receipt after 1 second
          const timer = setTimeout(() => {
            downloadPdfReceipt(foundSale);
          }, 1000);
          
          return () => clearTimeout(timer);
        } else {
          toast.error("Sale not found. Showing demo receipt.");
          // Create a dummy sale for demo purposes
          const demoSale = {
            id: saleId || "demo-" + Date.now().toString(),
            totalAmount: 99.99,
            paymentMethod: "card",
            date: new Date().toISOString(),
            items: [{ name: "Demo Item", quantity: 1, price: 99.99 }],
          };
          setSale(demoSale);
          
          // Auto-download PDF receipt after 1 second
          const timer = setTimeout(() => {
            downloadPdfReceipt(demoSale);
          }, 1000);
          
          return () => clearTimeout(timer);
        }
      } catch (error) {
        console.error("Error fetching sale:", error);
        toast.error("Failed to fetch sale details");
      } finally {
        setLoading(false);
      }
    };
    
    fetchSaleDetails();
  }, [saleId]);

  const downloadPdfReceipt = (sale: any) => {
    const doc = new jsPDF();
    const date = new Date(sale.date);
    const formattedDate = date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    const formattedTime = date.toLocaleTimeString("en-US");
    
    // Add logo/header
    doc.setFillColor(41, 98, 255);
    doc.rect(0, 0, 210, 40, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont("helvetica", "bold");
    doc.text("PULSE POS SYSTEM", 105, 20, { align: "center" });
    
    // Receipt info
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(`Receipt #${sale.id}`, 20, 50);
    doc.text(`${formattedDate} at ${formattedTime}`, 20, 60);
    doc.text(`Payment Method: ${sale.paymentMethod}`, 20, 70);
    
    // Divider
    doc.setDrawColor(200, 200, 200);
    doc.line(20, 75, 190, 75);
    
    // Items table
    const tableColumn = ["Item", "Qty", "Price", "Total"];
    const tableRows: any[][] = [];
    
    if (sale.items && sale.items.length > 0) {
      sale.items.forEach((item: any) => {
        const itemData = [
          item.name,
          item.quantity,
          formatCurrency(item.price),
          formatCurrency(item.quantity * item.price)
        ];
        tableRows.push(itemData);
      });
    } else {
      // If no items, create a generic entry
      tableRows.push([
        "Transaction",
        "1",
        formatCurrency(sale.totalAmount),
        formatCurrency(sale.totalAmount)
      ]);
    }
    
    if (sale.customAmount > 0) {
      tableRows.push([
        "Custom Amount",
        "1",
        formatCurrency(sale.customAmount),
        formatCurrency(sale.customAmount)
      ]);
    }
    
    // @ts-ignore
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 80,
      theme: "grid",
      styles: { fontSize: 10 },
      headStyles: { fillColor: [41, 98, 255] },
    });
    
    // Total
    const finalY = (doc as any).lastAutoTable.finalY + 10;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("Total:", 130, finalY);
    doc.text(formatCurrency(sale.totalAmount), 190, finalY, { align: "right" });
    
    // Footer
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("Thank you for your purchase!", 105, finalY + 20, { align: "center" });
    
    // Save the PDF
    doc.save(`PULSE-receipt-${sale.id}.pdf`);
  };

  const handleDownloadReceipt = () => {
    if (sale) {
      downloadReceipt(sale);
    }
  };

  const handlePrintReceipt = () => {
    if (sale) {
      downloadPdfReceipt(sale);
    }
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="container mx-auto py-8 px-4 text-center">
          <h1 className="text-2xl font-bold mb-4">Loading receipt...</h1>
        </div>
      </AppLayout>
    );
  }

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
        <Card className="border-green-200 shadow-xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-green-400 to-emerald-500 text-white border-b border-green-300">
            <div className="flex justify-center mb-4">
              <div className="bg-white rounded-full p-3">
                <Check className="h-8 w-8 text-green-500" />
              </div>
            </div>
            <CardTitle className="text-center text-2xl">Payment Successful!</CardTitle>
          </CardHeader>
          <CardContent className="pt-6 bg-gradient-to-br from-white to-green-50">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Transaction ID:</span>
                <span className="font-mono text-blue-700">{sale?.id}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Date:</span>
                <span className="text-blue-700">{new Date(sale?.date).toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Payment Method:</span>
                <span className="text-blue-700 font-medium">{sale?.paymentMethod}</span>
              </div>
              {sale?.cardNumber && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Card:</span>
                  <span className="text-blue-700">{sale?.cardNumber}</span>
                </div>
              )}
              <div className="flex justify-between items-center pt-4 border-t">
                <span className="font-bold">Total Amount:</span>
                <span className="font-bold text-xl text-green-600">
                  {formatCurrency(sale?.totalAmount)}
                </span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2 bg-gradient-to-t from-green-50 to-white">
            <Button 
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white" 
              onClick={handlePrintReceipt}
            >
              <Printer className="mr-2 h-4 w-4" />
              Print PDF Receipt
            </Button>
            <Button 
              variant="outline" 
              className="w-full border-blue-300 text-blue-700" 
              onClick={handleDownloadReceipt}
            >
              <Download className="mr-2 h-4 w-4" />
              Download Text Receipt
            </Button>
            <Button 
              variant="outline" 
              className="w-full border-green-300 text-green-700 hover:bg-green-50" 
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
