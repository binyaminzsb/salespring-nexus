
// Format currency without abbreviations for large numbers
export const formatCurrency = (amount: number) => {
  // Handle null, undefined or invalid input
  if (amount === null || amount === undefined || isNaN(amount)) {
    return "£0.00";
  }

  // Use standard currency format for all numbers
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
  }).format(amount);
};
