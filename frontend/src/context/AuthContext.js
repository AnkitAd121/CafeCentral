import { createContext, useContext, useEffect, useState, useCallback, useMemo } from "react";
import { api } from "@/lib/api";

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = useCallback(async () => {
    const token = localStorage.getItem("cc_session_token");
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const res = await api.get("/auth/me");
      setUser(res.data);
    } catch (e) {
      localStorage.removeItem("cc_session_token");
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = useCallback(() => {
    return new Promise((resolve, reject) => {
      if (!window.google) {
        reject(new Error("Google Identity Services not loaded"));
        return;
      }

      const client = window.google.accounts.oauth2.initTokenClient({
        client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
        scope: "openid email profile",
        callback: async (tokenResponse) => {
          if (tokenResponse.error) {
            reject(new Error(tokenResponse.error));
            return;
          }
          try {
            const res = await api.post("/auth/google", {
              access_token: tokenResponse.access_token,
            });
            // Store session token in localStorage
            localStorage.setItem("cc_session_token", res.data.session_token);
            setUser(res.data);
            resolve(res.data);
          } catch (e) {
            reject(e);
          }
        },
      });

      client.requestAccessToken({ prompt: "select_account" });
    });
  }, []);

  const logout = useCallback(async () => {
    try {
      await api.post("/auth/logout");
    } catch (error) {
      console.error("Logout failed:", error);
    }
    localStorage.removeItem("cc_session_token");
    setUser(null);
    if (window.google) {
      window.google.accounts.oauth2.revoke("", () => {});
    }
  }, []);

  const value = useMemo(
    () => ({ user, loading, login, logout, refresh: checkAuth, setUser }),
    [user, loading, login, logout, checkAuth]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
