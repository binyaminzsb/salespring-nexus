
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
          <h1 className="text-3xl font-bold">New Sale</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <NumberPad />
              <div className="mt-6">
                <CustomItemForm />
              </div>
            </div>

            <Card className="h-full">
              <CardContent className="p-4">
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-lg text-center">
                    <h3 className="font-medium text-gray-700">Quick Items</h3>
                    <p className="text-sm text-gray-500 mt-2">
                      Add frequently sold items here. <br />
                      Or use the Custom Item form to add one-time items.
                    </p>
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
