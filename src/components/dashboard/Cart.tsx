
import React, { useState } from "react";
import { CreditCard } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/utils/salesUtils";
import { toast } from "sonner";
import CartItemList from "./CartItemList";
import PaymentDialog from "./PaymentDialog";

const Cart: React.FC = () => {
  const { items, customAmount, totalAmount, updateItemQuantity, removeItem, clearCart } = useCart();
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);

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
          <CartItemList
            items={items}
            customAmount={customAmount}
            onQuantityChange={handleQuantityChange}
            onRemoveItem={handleRemoveItem}
          />
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

      <PaymentDialog
        open={isPaymentDialogOpen}
        onOpenChange={setIsPaymentDialogOpen}
        totalAmount={totalAmount}
      />
    </>
  );
};

export default Cart;
