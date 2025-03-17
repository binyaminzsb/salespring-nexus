
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/utils/salesUtils";
import { useCart } from "@/contexts/CartContext";

const NumberPad: React.FC = () => {
  const { addCustomAmount } = useCart();
  const [displayValue, setDisplayValue] = useState<string>("0.00");
  const [isFirstInput, setIsFirstInput] = useState(true);

  const handleNumberClick = (num: number) => {
    if (isFirstInput) {
      setDisplayValue(num.toString());
      setIsFirstInput(false);
    } else {
      setDisplayValue((prev) => {
        // Remove decimal and currency formatting
        const currentValue = prev.replace(/[^0-9.]/g, "");
        // Remove trailing zeros and decimal if needed
        const numericValue = parseFloat(currentValue + num);
        // Format as 2 decimal places
        return numericValue.toFixed(2);
      });
    }

    // Update cart with the new value
    addCustomAmount(displayValue === "0.00" ? num.toString() : displayValue + num);
  };

  const handleDecimalClick = () => {
    if (!displayValue.includes(".")) {
      setDisplayValue((prev) => prev + ".");
    }
  };

  const handleClearClick = () => {
    setDisplayValue("0.00");
    setIsFirstInput(true);
    addCustomAmount("");
  };

  const handleBackspace = () => {
    setDisplayValue((prev) => {
      // Remove formatting
      const currentValue = prev.replace(/[^0-9.]/g, "");
      if (currentValue.length <= 1) {
        setIsFirstInput(true);
        return "0.00";
      }
      const newValue = currentValue.slice(0, -1);
      return newValue.includes(".") ? newValue : parseFloat(newValue).toFixed(2);
    });
  };

  // Format for display
  const formattedDisplay = () => {
    try {
      return formatCurrency(parseFloat(displayValue));
    } catch (error) {
      return "$0.00";
    }
  };

  return (
    <div className="bg-white border rounded-lg p-4 shadow-sm">
      <div className="text-2xl font-medium text-center mb-4 p-2 bg-gray-50 rounded">
        {formattedDisplay()}
      </div>
      <div className="grid grid-cols-3 gap-2">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
          <Button
            key={num}
            variant="outline"
            className="h-12 text-lg"
            onClick={() => handleNumberClick(num)}
          >
            {num}
          </Button>
        ))}
        <Button
          variant="outline"
          className="h-12 text-lg"
          onClick={handleDecimalClick}
        >
          .
        </Button>
        <Button
          variant="outline" 
          className="h-12 text-lg"
          onClick={() => handleNumberClick(0)}
        >
          0
        </Button>
        <Button
          variant="outline"
          className="h-12 text-lg"
          onClick={handleBackspace}
        >
          ←
        </Button>
        <Button
          variant="secondary"
          className="col-span-3 h-12 mt-2"
          onClick={handleClearClick}
        >
          Clear
        </Button>
      </div>
    </div>
  );
};

export default NumberPad;
