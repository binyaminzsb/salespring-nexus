
// Define types for our cart items and context
export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export interface CartContextType {
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
