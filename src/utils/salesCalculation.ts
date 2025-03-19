
import { filterSalesByPeriod } from './salesFilter';

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
