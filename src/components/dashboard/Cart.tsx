
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Trash2, Plus, Minus, CreditCard, Loader2 } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/utils/salesUtils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";

const Cart: React.FC = () => {
  const { items, customAmount, totalAmount, updateItemQuantity, removeItem, clearCart, saveSale } = useCart();
  const navigate = useNavigate();
  
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleQuantityChange = (id: string, change: number) => {
    const item = items.find(item => item.id === id);
    if (item) {
      const newQuantity = Math.max(1, item.quantity + change);
      updateItemQuantity(id, newQuantity);
    }
  };

  const handleRemoveItem = (id: string) => {
    removeItem(id);
  };

  const handleCheckout = () => {
    if (totalAmount <= 0) {
      toast.error("Cart is empty");
      return;
    }
    setIsPaymentDialogOpen(true);
  };

  const handleProcessPayment = async () => {
    try {
      setIsProcessing(true);
      
      // Simulate payment processing delay (2 seconds)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Process the sale with card payment method
      const saleId = await saveSale("card");
      
      // Close dialog and reset form
      setIsPaymentDialogOpen(false);
      
      // Navigate to the success page
      navigate(`/payment-success/${saleId}`);
    } catch (error) {
      toast.error("Payment processing failed");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <Card className="h-full flex flex-col bg-gradient-to-br from-white to-blue-50">
        <CardHeader className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-t-lg">
          <CardTitle className="flex justify-between items-center text-blue-800">
            <span>Current Sale</span>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={clearCart}
              disabled={items.length === 0 && !customAmount}
              className="border-blue-300 text-blue-700 hover:bg-blue-200"
            >
              Clear
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 overflow-auto">
          {items.length === 0 && !customAmount ? (
            <div className="text-center py-8 text-gray-500">
              Cart is empty
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between items-center p-2 border-b border-blue-100">
                  <div className="flex-1">
                    <div className="font-medium text-gray-800">{item.name}</div>
                    <div className="text-sm text-blue-600">
                      {formatCurrency(item.price)} each
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 border-blue-300 text-blue-700"
                      onClick={() => handleQuantityChange(item.id, -1)}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-8 text-center">{item.quantity}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 border-blue-300 text-blue-700"
                      onClick={() => handleQuantityChange(item.id, 1)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-red-500 hover:bg-red-50"
                      onClick={() => handleRemoveItem(item.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
              
              {customAmount && parseFloat(customAmount) > 0 && (
                <div className="flex justify-between items-center p-2 border-b border-blue-100">
                  <div className="font-medium text-gray-800">Custom Amount</div>
                  <div className="text-blue-600">{formatCurrency(parseFloat(customAmount))}</div>
                </div>
              )}
            </div>
          )}
        </CardContent>
        <CardFooter className="flex-col border-t pt-4 bg-gradient-to-b from-blue-50 to-blue-100 rounded-b-lg">
          <div className="w-full flex justify-between text-lg font-bold mb-4">
            <span className="text-gray-800">Total</span>
            <span className="text-blue-700">{formatCurrency(totalAmount)}</span>
          </div>
          <Button 
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white" 
            size="lg"
            onClick={handleCheckout}
            disabled={totalAmount <= 0}
          >
            <CreditCard className="mr-2 h-5 w-5" />
            Checkout
          </Button>
        </CardFooter>
      </Card>

      <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
        <DialogContent className="sm:max-w-md bg-gradient-to-br from-white to-blue-50">
          <DialogHeader>
            <DialogTitle className="text-center text-blue-800 text-xl">Payment</DialogTitle>
            <DialogDescription className="text-center">
              Tap your card or phone to complete your purchase.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <div className="flex justify-center items-center h-24">
              <img 
                src="/payment-icons/card-tap.svg" 
                alt="Tap card" 
                className="h-full object-contain"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "/payment-icons/visa.png"; // Fallback image
                }}
              />
            </div>
            
            <div className="mt-6 text-center text-xl font-bold">
              {formatCurrency(totalAmount)}
            </div>
            
            <div className="mt-4 text-center text-sm text-gray-500">
              Tap your card or phone when prompted by the terminal
            </div>
          </div>
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsPaymentDialogOpen(false)}
              disabled={isProcessing}
              className="border-blue-300 text-blue-700"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleProcessPayment} 
              disabled={isProcessing}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                `Process Payment`
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Cart;
