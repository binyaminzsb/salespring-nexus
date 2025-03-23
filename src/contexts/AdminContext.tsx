
import React, { createContext, useContext, useState, useEffect } from "react";

interface AdminContextType {
  isAdmin: boolean;
  adminLogin: (password: string) => boolean;
  adminLogout: () => void;
}

const AdminContext = createContext<AdminContextType>({
  isAdmin: false,
  adminLogin: () => false,
  adminLogout: () => {},
});

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  
  // Check if admin is already logged in
  useEffect(() => {
    const adminStatus = localStorage.getItem("pulse_admin_status");
    if (adminStatus === "true") {
      setIsAdmin(true);
    }
  }, []);

  const adminLogin = (password: string): boolean => {
    if (password === "1300eeac") {
      setIsAdmin(true);
      localStorage.setItem("pulse_admin_status", "true");
      return true;
    }
    return false;
  };

  const adminLogout = () => {
    setIsAdmin(false);
    localStorage.removeItem("pulse_admin_status");
  };

  return (
    <AdminContext.Provider
      value={{
        isAdmin,
        adminLogin,
        adminLogout,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => useContext(AdminContext);
