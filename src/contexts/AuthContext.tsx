
import React, { createContext, useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

// Define types for our user and context
export interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => void;
}

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user database (will be replaced with Supabase later)
const MOCK_USERS_KEY = "blank_pos_users";
const CURRENT_USER_KEY = "blank_pos_current_user";

// Auth Provider component
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Load user on mount
  useEffect(() => {
    const loadUser = () => {
      const storedUser = localStorage.getItem(CURRENT_USER_KEY);
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
      setLoading(false);
    };

    loadUser();
  }, []);

  // Sign up function
  const signUp = async (name: string, email: string, password: string) => {
    try {
      setLoading(true);
      
      // Get existing users from localStorage
      const existingUsersJson = localStorage.getItem(MOCK_USERS_KEY);
      const existingUsers = existingUsersJson ? JSON.parse(existingUsersJson) : [];
      
      // Check if user already exists
      if (existingUsers.some((u: any) => u.email === email)) {
        throw new Error("User with this email already exists");
      }
      
      // Create new user
      const newUser = {
        id: Date.now().toString(),
        name,
        email,
        password, // In a real app, this would be hashed
      };
      
      // Add to users array
      const updatedUsers = [...existingUsers, newUser];
      localStorage.setItem(MOCK_USERS_KEY, JSON.stringify(updatedUsers));
      
      // Set current user (but remove password)
      const { password: _, ...userWithoutPassword } = newUser;
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userWithoutPassword));
      setUser(userWithoutPassword);
      
      toast.success("Account created successfully!");
      navigate("/dashboard");
    } catch (error: any) {
      toast.error(error.message || "Failed to create account");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Sign in function
  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      
      // Get users from localStorage
      const usersJson = localStorage.getItem(MOCK_USERS_KEY);
      const users = usersJson ? JSON.parse(usersJson) : [];
      
      // Find user with matching email and password
      const foundUser = users.find(
        (u: any) => u.email === email && u.password === password
      );
      
      if (!foundUser) {
        throw new Error("Invalid email or password");
      }
      
      // Set current user (but remove password)
      const { password: _, ...userWithoutPassword } = foundUser;
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userWithoutPassword));
      setUser(userWithoutPassword);
      
      toast.success("Signed in successfully!");
      navigate("/dashboard");
    } catch (error: any) {
      toast.error(error.message || "Failed to sign in");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Sign out function
  const signOut = () => {
    localStorage.removeItem(CURRENT_USER_KEY);
    setUser(null);
    toast.success("Signed out successfully");
    navigate("/");
  };

  // Value object to be provided by the context
  const value = {
    user,
    loading,
    signUp,
    signIn,
    signOut,
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
