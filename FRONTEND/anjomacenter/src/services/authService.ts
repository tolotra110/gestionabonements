import { api } from "./api";

export interface AuthUser {
  id: number;
  email: string;
}

interface AuthResponse {
  user: AuthUser;
}

export const authService = {
  login: (email: string, password: string) =>
    api.post("/auth/login", { email, password }) as Promise<AuthResponse>,
  currentUser: () => api.get("/auth/me") as Promise<AuthResponse>,
  logout: () => api.post("/auth/logout", {}),
};
