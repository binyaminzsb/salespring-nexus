
// Function to fetch sales data from localStorage
export const fetchSales = () => {
  const salesJson = localStorage.getItem("blank_pos_sales");
  return salesJson ? JSON.parse(salesJson) : [];
};

// Filter sales by time period
export const filterSalesByPeriod = (
  sales: any[],
  period: "daily" | "weekly" | "monthly" | "yearly"
) => {
  const now = new Date();
  const filtered = sales.filter((sale) => {
    const saleDate = new Date(sale.date);
    switch (period) {
      case "daily":
        return (
          saleDate.getDate() === now.getDate() &&
          saleDate.getMonth() === now.getMonth() &&
          saleDate.getFullYear() === now.getFullYear()
        );
      case "weekly":
        const dayOfWeek = now.getDay();
        const firstDayOfWeek = new Date(now);
        firstDayOfWeek.setDate(now.getDate() - dayOfWeek);
        return saleDate >= firstDayOfWeek;
      case "monthly":
        return (
          saleDate.getMonth() === now.getMonth() &&
          saleDate.getFullYear() === now.getFullYear()
        );
      case "yearly":
        return saleDate.getFullYear() === now.getFullYear();
      default:
        return true;
    }
  });
  return filtered;
};

// Calculate total sales for a given period
export const calculateTotalSales = (
  sales: any[],
  period: "daily" | "weekly" | "monthly" | "yearly"
) => {
  const filteredSales = filterSalesByPeriod(sales, period);
  return filteredSales.reduce((total, sale) => total + sale.totalAmount, 0);
};

// Group sales by day for charts
export const groupSalesByDay = (sales: any[], days = 7) => {
  const result: { date: string; total: number }[] = [];
  const now = new Date();
  
  // Create array of last 'days' days
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(now.getDate() - i);
    const dateString = date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
    
    // Find sales for this day
    const dayStart = new Date(date);
    dayStart.setHours(0, 0, 0, 0);
    
    const dayEnd = new Date(date);
    dayEnd.setHours(23, 59, 59, 999);
    
    const daySales = sales.filter((sale) => {
      const saleDate = new Date(sale.date);
      return saleDate >= dayStart && saleDate <= dayEnd;
    });
    
    const totalAmount = daySales.reduce(
      (total, sale) => total + sale.totalAmount,
      0
    );
    
    result.push({
      date: dateString,
      total: totalAmount,
    });
  }
  
  return result;
};

// Format currency
export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};

// Generate receipt text
export const generateReceiptText = (sale: any) => {
  const date = new Date(sale.date);
  const formattedDate = date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const formattedTime = date.toLocaleTimeString("en-US");
  
  let receiptText = `
BLANK POS SYSTEM
Receipt #${sale.id.substring(0, 8)}
${formattedDate} at ${formattedTime}
-------------------------------
`;

  sale.items.forEach((item: any) => {
    receiptText += `
${item.name}
${item.quantity} x ${formatCurrency(item.price)} = ${formatCurrency(
      item.quantity * item.price
    )}
`;
  });

  if (sale.customAmount > 0) {
    receiptText += `
Custom Amount: ${formatCurrency(sale.customAmount)}
`;
  }

  receiptText += `
-------------------------------
TOTAL: ${formatCurrency(sale.totalAmount)}
Payment Method: ${sale.paymentMethod}
`;

  if (sale.cardNumber) {
    receiptText += `Card: ${sale.cardNumber}
`;
  }

  receiptText += `
Thank you for your purchase!
`;

  return receiptText;
};

// Function to download receipt as text file
export const downloadReceipt = (sale: any) => {
  const receiptText = generateReceiptText(sale);
  const blob = new Blob([receiptText], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `receipt-${sale.id.substring(0, 8)}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

// Validate credit card number
export const validateCreditCard = (cardNumber: string) => {
  // Remove spaces
  const cleanNumber = cardNumber.replace(/\s+/g, "");
  
  // Check if number starts with 4, 5, or 6
  if (!/^[456]/.test(cleanNumber)) {
    return { valid: false, message: "Card number must start with 4, 5, or 6" };
  }
  
  // Check if number is 16 digits
  if (!/^\d{16}$/.test(cleanNumber)) {
    return { valid: false, message: "Card number must be 16 digits" };
  }
  
  return { valid: true, message: "Card is valid" };
};
