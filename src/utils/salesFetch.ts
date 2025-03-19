
// Function to fetch sales data from localStorage
export const fetchSales = () => {
  const salesJson = localStorage.getItem("blank_pos_sales");
  return salesJson ? JSON.parse(salesJson) : [];
};
