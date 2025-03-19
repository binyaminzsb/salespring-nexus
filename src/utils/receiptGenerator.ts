import { formatCurrency } from './salesFormat';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

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

// Function to generate and download a PDF receipt
export const generatePDF = (sale: any) => {
  const doc = new jsPDF();
  const date = new Date(sale.date);
  const formattedDate = date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const formattedTime = date.toLocaleTimeString("en-US");
  
  // Add receipt header
  doc.setFontSize(20);
  doc.text("Blank POS System", 105, 20, { align: "center" });
  doc.setFontSize(12);
  doc.text(`Receipt #${sale.id.substring(0, 8)}`, 105, 30, { align: "center" });
  doc.text(`${formattedDate} at ${formattedTime}`, 105, 38, { align: "center" });
  
  // Add transaction details
  doc.setFontSize(10);
  
  // Create table for items if available
  if (sale.items && sale.items.length > 0) {
    const tableColumn = ["Item", "Quantity", "Price", "Total"];
    const tableRows = sale.items.map((item: any) => [
      item.name,
      item.quantity,
      formatCurrency(item.price),
      formatCurrency(item.quantity * item.price),
    ]);
    
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 45,
      theme: 'grid',
    });
  } else {
    doc.text("Items: Not available", 20, 45);
  }
  
  // Add payment details
  let yPos = sale.items && sale.items.length > 0 ? (doc as any).lastAutoTable.finalY + 10 : 55;
  
  if (sale.customAmount > 0) {
    doc.text(`Custom Amount: ${formatCurrency(sale.customAmount)}`, 20, yPos);
    yPos += 8;
  }
  
  doc.text(`Payment Method: ${sale.paymentMethod}`, 20, yPos);
  yPos += 8;
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text(`Total: ${formatCurrency(sale.totalAmount)}`, 20, yPos);
  
  // Add footer
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text("Thank you for your business!", 105, yPos + 20, { align: "center" });
  
  // Save the PDF
  doc.save(`receipt-${sale.id.substring(0, 8)}.pdf`);
};
