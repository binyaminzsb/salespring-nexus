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
          PULSE POS SYSTEM
=================================
Receipt #${sale.id.substring(0, 8)}
${formattedDate} at ${formattedTime}
---------------------------------
`;

  if (sale.items && sale.items.length > 0) {
    sale.items.forEach((item: any) => {
      receiptText += `
${item.name}
${item.quantity} x ${formatCurrency(item.price)} = ${formatCurrency(
        item.quantity * item.price
      )}
`;
    });
  } else {
    receiptText += "\nNo items added to this transaction\n";
  }

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
  
  // Add color and styling
  const primaryColor = [99, 102, 241]; // Indigo
  const secondaryColor = [236, 72, 153]; // Pink
  const accentColor = [79, 70, 229]; // Deep blue
  
  // Add header with gradient-like effect
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.rect(0, 0, doc.internal.pageSize.width, 40, 'F');
  doc.setFillColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
  doc.rect(0, 35, doc.internal.pageSize.width, 10, 'F');
  
  // Add title
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text("PULSE POS SYSTEM", 105, 20, { align: "center" });
  
  // Add receipt info
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text(`Receipt #${sale.id.substring(0, 8)}`, 105, 55, { align: "center" });
  doc.text(`${formattedDate} at ${formattedTime}`, 105, 65, { align: "center" });
  
  // Add line separator
  doc.setDrawColor(accentColor[0], accentColor[1], accentColor[2]);
  doc.setLineWidth(0.5);
  doc.line(20, 70, 190, 70);
  
  // Create table for items if they exist
  let yPos = 80;
  
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
      startY: yPos,
      theme: 'grid',
      headStyles: { 
        fillColor: [99, 102, 241],
        textColor: [255, 255, 255],
        fontStyle: 'bold'
      },
      alternateRowStyles: {
        fillColor: [240, 240, 250]
      },
      styles: {
        lineColor: [200, 200, 200]
      }
    });
    yPos = (doc as any).lastAutoTable.finalY + 15;
  } else {
    doc.setFont('helvetica', 'italic');
    doc.text("No items added to this transaction", 105, yPos, { align: "center" });
    yPos += 20;
  }
  
  // Add box for payment info
  doc.setFillColor(245, 245, 255);
  doc.roundedRect(50, yPos - 7, 110, 40, 3, 3, 'F');
  doc.setDrawColor(accentColor[0], accentColor[1], accentColor[2]);
  doc.roundedRect(50, yPos - 7, 110, 40, 3, 3, 'S');
  
  doc.setFont('helvetica', 'normal');
  if (sale.customAmount > 0) {
    doc.text(`Custom Amount: ${formatCurrency(sale.customAmount)}`, 105, yPos, { align: "center" });
    yPos += 10;
  }
  
  doc.text(`Payment Method: ${sale.paymentMethod}`, 105, yPos, { align: "center" });
  yPos += 10;
  
  if (sale.cardNumber) {
    doc.text(`Card: ${sale.cardNumber}`, 105, yPos, { align: "center" });
    yPos += 10;
  }
  
  // Total amount
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(accentColor[0], accentColor[1], accentColor[2]);
  doc.text(`Total: ${formatCurrency(sale.totalAmount)}`, 105, yPos, { align: "center" });
  
  // Add footer
  const footerY = doc.internal.pageSize.height - 20;
  doc.setFillColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
  doc.rect(0, footerY - 5, doc.internal.pageSize.width, 10, 'F');
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(255, 255, 255);
  doc.text("Thank you for your business!", 105, footerY, { align: "center" });
  
  // Add decorative elements
  doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.setLineWidth(2);
  doc.circle(30, 20, 5, 'S');
  doc.circle(180, 20, 5, 'S');
  
  // Save the PDF
  doc.save(`receipt-${sale.id.substring(0, 8)}.pdf`);
};
