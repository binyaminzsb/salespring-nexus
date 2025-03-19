
import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { CartItem, CartContextType } from "@/types/cart";
import { calculateTotalAmount, saveSaleToSupabase, saveSaleToLocalStorage } from "@/utils/cartUtils";

// Create the context
const CartContext = createContext<CartContextType | undefined>(undefined);

// Cart Provider component
export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [customAmount, setCustomAmount] = useState<string>("");
  const [totalAmount, setTotalAmount] = useState<number>(0);

  // Calculate total amount whenever items or customAmount changes
  useEffect(() => {
    setTotalAmount(calculateTotalAmount(items, customAmount));
  }, [items, customAmount]);

  // Add item to cart
  const addItem = (item: Omit<CartItem, "id" | "quantity">) => {
    // Check if item already exists
    const existingItem = items.find(i => i.name === item.name);
    
    if (existingItem) {
      // Update quantity if item already exists
      updateItemQuantity(existingItem.id, existingItem.quantity + 1);
    } else {
      // Add new item
      const newItem = {
        ...item,
        id: Date.now().toString(),
        quantity: 1,
      };
      setItems((prevItems) => [...prevItems, newItem]);
      toast.success(`Added ${item.name} to cart`);
    }
  };

  // Add custom amount
  const addCustomAmount = (amount: string) => {
    setCustomAmount(amount);
  };

  // Update item quantity
  const updateItemQuantity = (id: string, quantity: number) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  // Remove item from cart
  const removeItem = (id: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== id));
    toast.success("Item removed from cart");
  };

  // Clear cart
  const clearCart = () => {
    setItems([]);
    setCustomAmount("");
    toast.success("Cart cleared");
  };

  // Save sale and generate receipt
  const saveSale = async (paymentMethod: string) => {
    try {
      // Calculate final amount
      const finalAmount = totalAmount;
      
      if (finalAmount <= 0) {
        throw new Error("Cannot process a sale with zero amount");
      }
      
      let saleId = "";
      let saveSuccessful = false;
      
      // Try to save to Supabase if user is logged in
      if (user) {
        const result = await saveSaleToSupabase(user.id, finalAmount, paymentMethod);
        if (result.success) {
          saleId = result.saleId!;
          saveSuccessful = true;
        }
      }
      
      // If Supabase save failed or user not logged in, use local storage
      if (!saveSuccessful) {
        saleId = `local-${Date.now()}`;
      }
      
      // Always save to local storage as well (as backup)
      saveSaleToLocalStorage(
        saleId,
        items,
        customAmount,
        finalAmount,
        paymentMethod,
        user ? user.id : 'guest'
      );
      
      // Clear cart after successful sale
      clearCart();
      
      return saleId;
    } catch (error: any) {
      console.error("Sale error:", error);
      toast.error(error.message || "Failed to process sale");
      throw error;
    }
  };

  // Value object to be provided by the context
  const value = {
    items,
    customAmount,
    totalAmount,
    addItem,
    addCustomAmount,
    updateItemQuantity,
    removeItem,
    clearCart,
    saveSale,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

// Custom hook to use the cart context
export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

// Re-export the CartItem type for convenience
export type { CartItem } from "@/types/cart";
