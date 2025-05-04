// src/contexts/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

/**
 * AuthProvider — просто хранит user = { name, photoUrl }
 * пока что «захардкожен» (или можно читать из localStorage / бэкенда).
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState({ name: "Admin", photoUrl: null });

  // пример: если вы хотите подтягивать из localStorage
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("currentUser") || "null");
    if (saved) setUser(saved);
  }, []);

  // если в будущем выйдет из бэкенда, то setUser(...) можно будет использовать
  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * useAuth() — хук для доступа к { user, setUser }
 */
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}
