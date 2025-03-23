
// Filter sales by time period
export const filterSalesByPeriod = (
  sales: any[],
  period: "daily" | "weekly" | "monthly" | "yearly"
) => {
  const now = new Date();
  const filtered = sales.filter((sale) => {
    const saleDate = new Date(sale.date || sale.created_at);
    
    switch (period) {
      case "daily":
        return (
          saleDate.getDate() === now.getDate() &&
          saleDate.getMonth() === now.getMonth() &&
          saleDate.getFullYear() === now.getFullYear()
        );
      case "weekly":
        // Get the start of the current week (Sunday)
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay());
        startOfWeek.setHours(0, 0, 0, 0);
        
        // Get the end of the current week (Saturday)
        const endOfWeek = new Date(now);
        endOfWeek.setDate(now.getDate() + (6 - now.getDay()));
        endOfWeek.setHours(23, 59, 59, 999);
        
        // Check if sale date is within this week range
        return saleDate >= startOfWeek && saleDate <= endOfWeek;
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
