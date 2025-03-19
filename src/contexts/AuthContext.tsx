
import React, { createContext, useContext } from "react";
import { AuthContextType } from "@/types/auth";
import { useAuthApi } from "@/hooks/useAuthApi";
import { useAuthSession } from "@/hooks/useAuthSession";

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth Provider component
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { user, loading: sessionLoading } = useAuthSession();
  const { loading: apiLoading, signUp, signIn, signOut, updatePassword } = useAuthApi();

  // Combine loading states
  const loading = sessionLoading || apiLoading;

  // Value object to be provided by the context
  const value = {
    user,
    loading,
    signUp,
    signIn,
    signOut,
    updatePassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
