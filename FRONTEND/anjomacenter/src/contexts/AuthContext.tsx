import {
  useCallback,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { ApiError } from "../services/api";
import { authService, type AuthUser } from "../services/authService";
import { AuthContext } from "./auth";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [sessionError, setSessionError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    authService
      .currentUser()
      .then(({ user: current }) => {
        if (active) setUser(current);
      })
      .catch((error: unknown) => {
        if (!active) return;
        if (!(error instanceof ApiError && error.status === 401)) {
          setSessionError("Impossible de vérifier la session auprès du serveur.");
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const response = await authService.login(email, password);
    setUser(response.user);
    setSessionError(null);
  }, []);

  const logout = useCallback(async () => {
    await authService.logout();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, sessionError, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
