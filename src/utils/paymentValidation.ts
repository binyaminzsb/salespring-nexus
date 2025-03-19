
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
