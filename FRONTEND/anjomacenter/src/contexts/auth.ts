import { createContext, useContext } from "react";
import type { AuthUser } from "../services/authService";

export interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  sessionError: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth doit être utilisé dans AuthProvider");
  return context;
}
