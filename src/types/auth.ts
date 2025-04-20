
export interface User {
  id: string;
  email: string;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => void;
  updatePassword: (currentPassword: string, newPassword: string) => Promise<boolean>;
  updateProfile: (data: Partial<User>) => Promise<boolean>;
  deleteAccount: () => Promise<boolean>;
  resetSalesData: () => Promise<boolean>;
}
