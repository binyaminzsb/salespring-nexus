
import React from "react";
import { CartItem as CartItemType } from "@/types/cart";
import CartItemComponent from "./CartItem";
import { formatCurrency } from "@/utils/salesFormat";

interface CartItemListProps {
  items: CartItemType[];
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
        <CartItemComponent
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
