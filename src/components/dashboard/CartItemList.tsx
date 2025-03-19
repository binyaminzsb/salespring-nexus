
import React from "react";
import { CartItem } from "@/types/cart";
import CartItem from "./CartItem";
import { formatCurrency } from "@/utils/salesUtils";

interface CartItemListProps {
  items: CartItem[];
  customAmount: string;
  onQuantityChange: (id: string, change: number) => void;
  onRemoveItem: (id: string) => void;
}

const CartItemList: React.FC<CartItemListProps> = ({
  items,
  customAmount,
  onQuantityChange,
  onRemoveItem,
}) => {
  const hasCustomAmount = customAmount && parseFloat(customAmount) > 0;
  
  if (items.length === 0 && !hasCustomAmount) {
    return (
      <div className="text-center py-8 text-gray-500">
        Cart is empty
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <CartItem
          key={item.id}
          item={item}
          onQuantityChange={onQuantityChange}
          onRemoveItem={onRemoveItem}
        />
      ))}
      
      {hasCustomAmount && (
        <div className="flex justify-between items-center p-2 border-b border-blue-100">
          <div className="font-medium text-gray-800">Custom Amount</div>
          <div className="text-blue-600">{formatCurrency(parseFloat(customAmount))}</div>
        </div>
      )}
    </div>
  );
};

export default CartItemList;
