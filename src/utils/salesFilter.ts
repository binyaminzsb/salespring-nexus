
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
