// src/contexts/MonitoringContext.jsx
import React, { createContext, useContext, useState } from "react";

const MonitoringContext = createContext(null);

export function MonitoringProvider({ children }) {
  // Все записи мониторинга
  const [entries, setEntries] = useState([]);

  // Добавить новую запись
  const addEntry = (entry) => {
    setEntries((prev) => [...prev, entry]);
  };

  // Обновить существующую запись по id
  const updateEntry = (entry) => {
    setEntries((prev) =>
      prev.map((e) => (e.id === entry.id ? { ...e, ...entry } : e))
    );
  };

  // Удалить запись по id
  const deleteEntry = (id) => {
    setEntries((prev) => prev.filter((e) => e.id !== id));
  };

  return (
    <MonitoringContext.Provider
      value={{ entries, addEntry, updateEntry, deleteEntry }}
    >
      {children}
    </MonitoringContext.Provider>
  );
}

export function useMonitoring() {
  const ctx = useContext(MonitoringContext);
  if (!ctx) {
    throw new Error("useMonitoring must be used within a MonitoringProvider");
  }
  return ctx;
}
