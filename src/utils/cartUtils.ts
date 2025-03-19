
import { CartItem } from "@/types/cart";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Local storage key for sales
export const SALES_KEY = "blank_pos_sales";

// Calculate total amount from items and custom amount
export const calculateTotalAmount = (items: CartItem[], customAmount: string): number => {
  const itemsTotal = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const customTotal = customAmount && !isNaN(parseFloat(customAmount)) ? parseFloat(customAmount) : 0;
  return itemsTotal + customTotal;
};

// Save sale to Supabase
export const saveSaleToSupabase = async (
  userId: string,
  totalAmount: number,
  paymentMethod: string
) => {
  console.log("Attempting to save transaction to Supabase...");
  
  try {
    const { data, error } = await supabase
      .from('sales')
      .insert({
        total: totalAmount,
        payment_method: paymentMethod,
        user_id: userId
      })
      .select();
    
    if (error) {
      console.error("Supabase error:", error);
      
      // For the recursion error, we'll use local storage fallback but not throw
      if (error.message.includes("infinite recursion") || error.message.includes("admin_users")) {
        console.log("Using local storage fallback due to Supabase policy issue");
        return { success: false };
      } else {
        throw new Error(`Database error: ${error.message}`);
      }
    } 
    
    if (data && data.length > 0) {
      console.log("Transaction saved to Supabase with ID:", data[0].id);
      return { success: true, saleId: data[0].id };
    }
    
    return { success: false };
  } catch (dbError: any) {
    console.error("Database operation error:", dbError);
    return { success: false };
  }
};

// Save sale to local storage
export const saveSaleToLocalStorage = (
  saleId: string,
  items: CartItem[],
  customAmount: string,
  totalAmount: number,
  paymentMethod: string,
  userId: string
) => {
  console.log("Saving sale to local storage");
  
  const sale = {
    id: saleId,
    items,
    customAmount: customAmount && !isNaN(parseFloat(customAmount)) ? parseFloat(customAmount) : 0,
    totalAmount,
    paymentMethod,
    date: new Date().toISOString(),
    userId
  };
  
  // Get existing sales from localStorage
  const existingSalesJson = localStorage.getItem(SALES_KEY);
  const existingSales = existingSalesJson ? JSON.parse(existingSalesJson) : [];
  
  // Add new sale
  const updatedSales = [...existingSales, sale];
  localStorage.setItem(SALES_KEY, JSON.stringify(updatedSales));
  
  return saleId;
};
