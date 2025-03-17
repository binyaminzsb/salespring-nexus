
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Trash2, Plus, Minus, CreditCard } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiryMonth, setCardExpiryMonth] = useState("");
  const [cardExpiryYear, setCardExpiryYear] = useState("");
  const [cardCvv, setCardCvv] = useState("");
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

  const formatCardNumber = (value: string) => {
    // Remove all non-digit characters
    const digits = value.replace(/\D/g, "");
    
    // Limit to 16 digits
    const limited = digits.slice(0, 16);
    
    // Add spaces every 4 digits
    const formatted = limited.replace(/(\d{4})(?=\d)/g, "$1 ");
    
    return formatted;
  };

  const validatePaymentDetails = () => {
    // Clean card number
    const cleanCardNumber = cardNumber.replace(/\s+/g, "");
    
    // Validate card number starts with 4, 5, or 6
    if (!/^[456]/.test(cleanCardNumber)) {
      toast.error("Card number must start with 4, 5, or 6");
      return false;
    }
    
    // Validate card number length
    if (cleanCardNumber.length !== 16) {
      toast.error("Card number must be 16 digits");
      return false;
    }
    
    // Validate expiry month
    if (!cardExpiryMonth || parseInt(cardExpiryMonth) < 1 || parseInt(cardExpiryMonth) > 12) {
      toast.error("Please enter a valid expiry month (1-12)");
      return false;
    }
    
    // Validate expiry year
    const currentYear = new Date().getFullYear() % 100; // Get last 2 digits of year
    if (!cardExpiryYear || parseInt(cardExpiryYear) < currentYear) {
      toast.error("Card is expired");
      return false;
    }
    
    // Validate CVV
    if (!cardCvv || cardCvv.length < 3 || cardCvv.length > 4) {
      toast.error("Please enter a valid CVV");
      return false;
    }
    
    return true;
  };

  const handleProcessPayment = async () => {
    try {
      if (!validatePaymentDetails()) {
        return;
      }

      setIsProcessing(true);
      
      // Simulate payment processing delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Process the sale
      const saleId = await saveSale("Credit Card", cardNumber.replace(/\s+/g, ""));
      
      // Close dialog and reset form
      setIsPaymentDialogOpen(false);
      setCardNumber("");
      setCardExpiryMonth("");
      setCardExpiryYear("");
      setCardCvv("");
      
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
      <Card className="h-full flex flex-col">
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>Current Sale</span>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={clearCart}
              disabled={items.length === 0 && !customAmount}
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
                <div key={item.id} className="flex justify-between items-center p-2 border-b">
                  <div className="flex-1">
                    <div className="font-medium">{item.name}</div>
                    <div className="text-sm text-gray-500">
                      {formatCurrency(item.price)} each
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleQuantityChange(item.id, -1)}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-8 text-center">{item.quantity}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleQuantityChange(item.id, 1)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive"
                      onClick={() => handleRemoveItem(item.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
              
              {customAmount && parseFloat(customAmount) > 0 && (
                <div className="flex justify-between items-center p-2 border-b">
                  <div className="font-medium">Custom Amount</div>
                  <div>{formatCurrency(parseFloat(customAmount))}</div>
                </div>
              )}
            </div>
          )}
        </CardContent>
        <CardFooter className="flex-col border-t pt-4">
          <div className="w-full flex justify-between text-lg font-bold mb-4">
            <span>Total</span>
            <span>{formatCurrency(totalAmount)}</span>
          </div>
          <Button 
            className="w-full" 
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
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Payment Information</DialogTitle>
            <DialogDescription>
              Enter your credit card details to complete the purchase.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Card Number</label>
              <Input
                placeholder="4111 1111 1111 1111"
                value={cardNumber}
                onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Exp. Month</label>
                <Input
                  placeholder="MM"
                  maxLength={2}
                  value={cardExpiryMonth}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "").slice(0, 2);
                    setCardExpiryMonth(value);
                  }}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Exp. Year</label>
                <Input
                  placeholder="YY"
                  maxLength={2}
                  value={cardExpiryYear}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "").slice(0, 2);
                    setCardExpiryYear(value);
                  }}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">CVV</label>
                <Input
                  placeholder="123"
                  maxLength={4}
                  value={cardCvv}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "").slice(0, 4);
                    setCardCvv(value);
                  }}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsPaymentDialogOpen(false)}
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button onClick={handleProcessPayment} disabled={isProcessing}>
              {isProcessing ? "Processing..." : `Pay ${formatCurrency(totalAmount)}`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Cart;
