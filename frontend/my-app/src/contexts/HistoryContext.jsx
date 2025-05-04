// src/contexts/HistoryContext.jsx
import React, { createContext, useContext, useState } from "react";

const HistoryContext = createContext(null);

export function HistoryProvider({ children }) {
  // events — это массив всех записей истории
  const [events, setEvents] = useState([]);

  // addEvent добавляет новую запись
  const addEvent = ({ type, params = {}, file = "" }) => {
    const newEvent = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      user: "admin", // тут можно подтягивать реального пользователя
      type,
      params,
      file,
    };
    setEvents((prev) => [newEvent, ...prev]);
  };

  return (
    <HistoryContext.Provider value={{ events, addEvent }}>
      {children}
    </HistoryContext.Provider>
  );
}

// хук для доступа к истории из любых компонентов
export function useHistoryLog() {
  const ctx = useContext(HistoryContext);
  if (!ctx) {
    throw new Error("useHistoryLog must be used inside HistoryProvider");
  }
  return ctx;
}
