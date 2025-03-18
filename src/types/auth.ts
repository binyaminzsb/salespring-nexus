
export interface User {
  id: string;
  name: string;
  email: string;
  username?: string;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  signUp: (name: string, email: string, password: string, username: string) => Promise<void>;
  signIn: (emailOrUsername: string, password: string) => Promise<void>;
  signOut: () => void;
}
