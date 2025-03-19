
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
      // Update cart with the new value
      addCustomAmount(num.toString());
    } else {
      // Append digit to current value - no digit limit
      const newValue = displayValue + num.toString();
      setDisplayValue(newValue);
      // Update cart with the new value
      addCustomAmount(newValue);
    }
  };

  const handleDecimalClick = () => {
    if (!displayValue.includes(".")) {
      setDisplayValue((prev) => prev + ".");
      addCustomAmount(displayValue + ".");
    }
  };

  const handleClearClick = () => {
    setDisplayValue("0.00");
    setIsFirstInput(true);
    addCustomAmount("");
  };

  const handleBackspace = () => {
    setDisplayValue((prev) => {
      if (prev.length <= 1 || (prev.length === 4 && prev.includes("."))) {
        setIsFirstInput(true);
        addCustomAmount("");
        return "0.00";
      }
      
      const newValue = prev.slice(0, -1);
      addCustomAmount(newValue);
      return newValue;
    });
  };

  // Format for display
  const formattedDisplay = () => {
    try {
      if (displayValue === "" || displayValue === "0.00") {
        return "$0.00";
      }
      
      if (displayValue.endsWith(".")) {
        return `$${displayValue}`;
      }
      
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
