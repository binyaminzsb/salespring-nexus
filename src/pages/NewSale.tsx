
import React from "react";
import AppLayout from "@/components/dashboard/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import NumberPad from "@/components/dashboard/NumberPad";
import Cart from "@/components/dashboard/Cart";
import CustomItemForm from "@/components/dashboard/CustomItemForm";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";
import { formatCurrency } from "@/utils/salesFormat";

const NewSale = () => {
  const { addItem } = useCart();

  const handleQuickItemClick = (item: string, price: number) => {
    console.log("Adding quick item:", item, price);
    addItem({
      name: item,
      price: price
    });
    toast.success(`Added ${item} to cart`);
  };

  // Sample quick items with prices
  const quickItems = [
    { name: 'Coffee', price: 3.99 },
    { name: 'Sandwich', price: 6.99 },
    { name: 'Salad', price: 8.99 },
    { name: 'Pastry', price: 3.49 },
    { name: 'Juice', price: 4.49 },
    { name: 'Water', price: 1.99 }
  ];

  return (
    <AppLayout>
      <div className="container mx-auto py-10 px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold logo-text">New Sale</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <NumberPad />
              <div className="mt-6">
                <CustomItemForm />
              </div>
            </div>

            <Card className="h-full border-0 shadow-md overflow-hidden card-gradient">
              <div className="h-1.5 bg-gradient-to-r from-indigo-500 to-purple-500"></div>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="p-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg text-center border border-indigo-100 shadow-sm">
                    <h3 className="font-medium text-indigo-700 text-lg">Quick Items</h3>
                    <p className="text-sm text-gray-600 mt-2">
                      Click on an item to add it to the cart.
                    </p>
                  </div>
                  
                  <div className="mt-8 grid grid-cols-2 gap-3">
                    {quickItems.map((item, index) => (
                      <div 
                        key={index}
                        className="p-4 border border-indigo-100 rounded-lg text-center bg-white hover:bg-indigo-50 hover:border-indigo-300 transition-all cursor-pointer shadow-sm"
                        onClick={() => handleQuickItemClick(item.name, item.price)}
                      >
                        <div className="text-indigo-700">{item.name}</div>
                        <div className="text-sm text-gray-500">{formatCurrency(item.price)}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1 h-[calc(100vh-12rem)] overflow-hidden">
            <Cart />
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default NewSale;
