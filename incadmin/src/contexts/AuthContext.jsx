import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { getAccessToken, clearTokens } from "@/services/apiClient";
import {
  fetchMe,
  loginRequest,
  logoutRequest,
} from "@/services/auth.service";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isBootLoading, setIsBootLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const token = getAccessToken();
    if (!token) {
      setIsInitializing(false);
      return;
    }

    fetchMe()
      .then(setUser)
      .catch(() => clearTokens())
      .finally(() => setIsInitializing(false));
  }, []);

  const login = useCallback(async (email, password) => {
    const loggedInUser = await loginRequest(email, password);
    setUser(loggedInUser);
    setIsBootLoading(true);
  }, []);

  const logout = useCallback(async () => {
    await logoutRequest();
    setUser(null);
  }, []);

  const completeBoot = useCallback(() => setIsBootLoading(false), []);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isBootLoading,
      isInitializing,
      login,
      logout,
      completeBoot,
    }),
    [user, isBootLoading, isInitializing, login, logout, completeBoot]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
