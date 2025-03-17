
import React, { useState } from "react";
import { Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useCart } from "@/contexts/CartContext";

const formSchema = z.object({
  name: z.string().min(1, { message: "Item name is required" }),
  price: z.string().refine(
    (value) => {
      const num = parseFloat(value);
      return !isNaN(num) && num > 0;
    },
    {
      message: "Price must be a positive number",
    }
  ),
});

type FormValues = z.infer<typeof formSchema>;

const CustomItemForm: React.FC = () => {
  const { addItem } = useCart();
  const [isAdding, setIsAdding] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      price: "",
    },
  });

  const onSubmit = (values: FormValues) => {
    const price = parseFloat(values.price);
    
    addItem({
      name: values.name,
      price,
    });
    
    form.reset({ name: "", price: "" });
  };

  return (
    <div className="bg-white border rounded-lg p-4 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-medium">Add Custom Item</h3>
        {!isAdding && (
          <Button size="sm" variant="ghost" onClick={() => setIsAdding(true)}>
            <Plus className="h-4 w-4 mr-1" />
            New Item
          </Button>
        )}
      </div>

      {isAdding ? (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Item Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Custom Product" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="10.00"
                      {...field}
                      onChange={(e) => {
                        // Only allow numbers and a single decimal point
                        const value = e.target.value.replace(/[^0-9.]/g, "");
                        // Ensure only one decimal point
                        const parts = value.split(".");
                        const formatted = parts.length > 1 
                          ? parts[0] + "." + parts.slice(1).join("")
                          : value;
                        field.onChange(formatted);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex space-x-2">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => {
                  setIsAdding(false);
                  form.reset();
                }}
              >
                Cancel
              </Button>
              <Button type="submit" className="flex-1">
                Add to Cart
              </Button>
            </div>
          </form>
        </Form>
      ) : (
        <div className="text-sm text-gray-500">
          Create custom items to add to the current sale.
        </div>
      )}
    </div>
  );
};

export default CustomItemForm;
