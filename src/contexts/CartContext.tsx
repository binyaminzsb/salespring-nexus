
import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

// Define types for our items and context
export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  customAmount: string;
  totalAmount: number;
  addItem: (item: Omit<CartItem, "id" | "quantity">) => void;
  addCustomAmount: (amount: string) => void;
  updateItemQuantity: (id: string, quantity: number) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  saveSale: (paymentMethod: string) => Promise<string>;
}

// Create the context
const CartContext = createContext<CartContextType | undefined>(undefined);

// Mock sales database (will be replaced with Supabase later)
const SALES_KEY = "blank_pos_sales";

// Cart Provider component
export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [customAmount, setCustomAmount] = useState<string>("");
  const [totalAmount, setTotalAmount] = useState<number>(0);

  // Calculate total amount whenever items or customAmount changes
  useEffect(() => {
    const itemsTotal = items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
    const customTotal = customAmount && !isNaN(parseFloat(customAmount)) ? parseFloat(customAmount) : 0;
    setTotalAmount(itemsTotal + customTotal);
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
        try {
          // Create transaction in Supabase
          const { data, error } = await supabase
            .from('pos_transactions')
            .insert({
              total: finalAmount,
              payment_method: paymentMethod,
              user_id: user.id
            })
            .select();
          
          if (error) {
            console.error("Supabase error:", error);
            throw new Error("Failed to save transaction to database");
          }
          
          if (data && data.length > 0) {
            saleId = data[0].id;
            saveSuccessful = true;
          }
        } catch (dbError) {
          console.error("Database operation error:", dbError);
          throw dbError;
        }
      } else {
        throw new Error("User must be logged in to save transaction");
      }
      
      // Always save to local storage as well (as backup)
      const sale = {
        id: saleId,
        items,
        customAmount: customAmount && !isNaN(parseFloat(customAmount)) ? parseFloat(customAmount) : 0,
        totalAmount: finalAmount,
        paymentMethod,
        date: new Date().toISOString(),
        userId: user ? user.id : 'guest'
      };
      
      // Get existing sales from localStorage
      const existingSalesJson = localStorage.getItem(SALES_KEY);
      const existingSales = existingSalesJson ? JSON.parse(existingSalesJson) : [];
      
      // Add new sale
      const updatedSales = [...existingSales, sale];
      localStorage.setItem(SALES_KEY, JSON.stringify(updatedSales));
      
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
