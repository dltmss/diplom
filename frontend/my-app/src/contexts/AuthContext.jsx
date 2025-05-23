import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useSettings } from "./SettingsContext.jsx";
import { getCurrentUser, logoutUser } from "@/lib/auth"; // 👈

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const { settings } = useSettings();
  const { idleTimeout } = settings;

  // ✅ Выход
  const logout = useCallback(() => {
    logoutUser(); // удаляет токен из localStorage
    setUser(null);
  }, []);

  // ✅ При загрузке получаем пользователя (если есть токен)
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    getCurrentUser()
      .then(setUser)
      .catch(() => {
        logout(); // токен недействителен — выходим
      });
  }, [logout]);

  // ✅ Автоматический выход по бездействию
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

  // ✅ Ручной вход (после login)
  const login = async () => {
    try {
      const userData = await getCurrentUser();
      setUser(userData);
    } catch {
      logout();
    }
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
