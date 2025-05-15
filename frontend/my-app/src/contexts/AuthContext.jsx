import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useSettings } from "./SettingsContext.jsx";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const { settings } = useSettings();
  const { idleTimeout } = settings;

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem("currentUser");
  }, []);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("currentUser") || "null");
    if (saved) setUser(saved);
  }, []);

  useEffect(() => {
    if (!user) return;

    let timerId;

    const resetTimer = () => {
      clearTimeout(timerId);
      timerId = setTimeout(logout, idleTimeout * 60 * 1000);
    };

    window.addEventListener("mousemove", resetTimer);
    window.addEventListener("mousedown", resetTimer);
    window.addEventListener("keydown", resetTimer);
    window.addEventListener("touchstart", resetTimer);

    resetTimer();

    return () => {
      clearTimeout(timerId);
      window.removeEventListener("mousemove", resetTimer);
      window.removeEventListener("mousedown", resetTimer);
      window.removeEventListener("keydown", resetTimer);
      window.removeEventListener("touchstart", resetTimer);
    };
  }, [user, idleTimeout, logout]);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("currentUser", JSON.stringify(userData));
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}
