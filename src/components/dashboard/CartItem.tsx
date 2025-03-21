
import React from "react";
import { Trash2, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/utils/salesFormat";
import { CartItem as CartItemType } from "@/types/cart";

interface CartItemProps {
  item: CartItemType;
  onQuantityChange: (id: string, change: number) => void;
  onRemoveItem: (id: string) => void;
}

const CartItem: React.FC<CartItemProps> = ({ item, onQuantityChange, onRemoveItem }) => {
  return (
    <div className="flex justify-between items-center p-2 border-b border-blue-100">
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
          onClick={() => onQuantityChange(item.id, -1)}
        >
          <Minus className="h-4 w-4" />
        </Button>
        <span className="w-8 text-center">{item.quantity}</span>
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 border-blue-300 text-blue-700"
          onClick={() => onQuantityChange(item.id, 1)}
        >
          <Plus className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-red-500 hover:bg-red-50"
          onClick={() => onRemoveItem(item.id)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default CartItem;
