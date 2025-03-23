
// Format currency with abbreviations (K, M, B, T) for large numbers
export const formatCurrency = (amount: number) => {
  // Handle null, undefined or invalid input
  if (amount === null || amount === undefined || isNaN(amount)) {
    return "£0.00";
  }

  // Define thresholds and abbreviations
  const thresholds = [
    { value: 1e12, symbol: "T" }, // Trillion
    { value: 1e9, symbol: "B" }, // Billion
    { value: 1e6, symbol: "M" }, // Million
    { value: 1e3, symbol: "K" }, // Thousand
    { value: 1, symbol: "" }     // Regular
  ];

  // Find the appropriate threshold
  const threshold = thresholds.find(t => Math.abs(amount) >= t.value);

  if (threshold) {
    // Format based on the threshold
    const formatted = (amount / threshold.value).toFixed(2);
    // Remove trailing zeros and decimal point if not needed
    const cleanFormatted = formatted.replace(/\.00$/, "");
    return `£${cleanFormatted}${threshold.symbol}`;
  }

  // Fallback to standard currency format for small numbers
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
  }).format(amount);
};
