
import { formatCurrency } from './salesFormat';

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
=================================
          BLANK POS SYSTEM
=================================
Receipt #${sale.id.substring(0, 8)}
${formattedDate} at ${formattedTime}
---------------------------------
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
---------------------------------
TOTAL: ${formatCurrency(sale.totalAmount)}
Payment Method: ${sale.paymentMethod}
`;

  if (sale.cardNumber) {
    receiptText += `Card: ${sale.cardNumber}
`;
  }

  receiptText += `
=================================
    Thank you for your purchase!
=================================
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
