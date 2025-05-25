// src/contexts/AuthContext.jsx
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useSettings } from "./SettingsContext.jsx";
import { getCurrentUser, logoutUser } from "@/lib/auth"; // функция, которая делает запрос /me и возвращает данные пользователя

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const { settings } = useSettings();
  const { idleTimeout } = settings;

  // Функция выхода
  const logout = useCallback(() => {
    logoutUser(); // чистим токен
    setUser(null);
  }, []);

  // При монтировании пытаемся получить текущего пользователя по токену
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    getCurrentUser()
      .then((userData) => {
        setUser(userData);
      })
      .catch(() => {
        logout(); // если токен просрочен или невалиден
      });
  }, [logout]);

  // Автоматический logout по бездействию
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

    // запускаем первый раз
    resetTimer();

    return () => {
      clearTimeout(timerId);
      window.removeEventListener("mousemove", resetTimer);
      window.removeEventListener("mousedown", resetTimer);
      window.removeEventListener("keydown", resetTimer);
      window.removeEventListener("touchstart", resetTimer);
    };
  }, [user, idleTimeout, logout]);

  // Функция ручного логина (например, после формы входа)
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
