
import React, { createContext, useContext } from "react";
import { AuthContextType } from "@/types/auth";
import { useAuthSession } from "@/hooks/useAuthSession";
import { useAuthApi } from "@/hooks/useAuthApi";

export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signUp: async () => {},
  signIn: async () => {},
  signOut: () => {},
  updatePassword: async () => false,
  updateProfile: async () => false,
  deleteAccount: async () => false,
  resetSalesData: async () => false
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  const { user, setUser, loading } = useAuthSession();
  const { 
    loading: apiLoading, 
    signUp, 
    signIn, 
    signOut, 
    updatePassword,
    updateProfile,
    deleteAccount,
    resetSalesData
  } = useAuthApi();

  return (
    <AuthContext.Provider 
      value={{
        user,
        loading: loading || apiLoading,
        signUp,
        signIn,
        signOut,
        updatePassword,
        updateProfile,
        deleteAccount,
        resetSalesData
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
