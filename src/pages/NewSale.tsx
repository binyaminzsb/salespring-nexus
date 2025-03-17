
import React from "react";
import AppLayout from "@/components/dashboard/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import NumberPad from "@/components/dashboard/NumberPad";
import Cart from "@/components/dashboard/Cart";
import CustomItemForm from "@/components/dashboard/CustomItemForm";

const NewSale = () => {
  return (
    <AppLayout>
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text">New Sale</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <NumberPad />
              <div className="mt-6">
                <CustomItemForm />
              </div>
            </div>

            <Card className="h-full bg-gradient-to-br from-white to-indigo-50 shadow-md">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg text-center border border-blue-100 shadow-sm">
                    <h3 className="font-medium text-blue-700 text-lg">Quick Items</h3>
                    <p className="text-sm text-gray-600 mt-2">
                      Add frequently sold items here. <br />
                      Or use the Custom Item form to add one-time items.
                    </p>
                  </div>
                  
                  <div className="mt-8 grid grid-cols-2 gap-3">
                    {['Coffee', 'Sandwich', 'Salad', 'Pastry', 'Juice', 'Water'].map((item, index) => (
                      <div 
                        key={index}
                        className="p-4 border border-blue-100 rounded-lg text-center bg-white hover:bg-blue-50 hover:border-blue-300 transition-all cursor-pointer shadow-sm"
                      >
                        <span className="text-blue-700">{item}</span>
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
