// src/contexts/MonitoringContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import {
  fetchMonitoringData,
  createMonitoringEntry,
  updateMonitoringEntry,
  deleteMonitoringEntry,
} from "../api/monitoring.js"; // <--- обязательно относительный путь!

const MonitoringContext = createContext();

export function MonitoringProvider({ children }) {
  const [entries, setEntries] = useState([]);

  // при загрузке — фетчим все записи
  useEffect(() => {
    (async () => {
      try {
        const data = await fetchMonitoringData();
        setEntries(data);
      } catch (err) {
        console.error("Не удалось загрузить monitoring:", err);
      }
    })();
  }, []);

  const addEntry = async (entry) => {
    const created = await createMonitoringEntry(entry);
    // вставляем в конец списка
    setEntries((prev) => [...prev, created]);
  };

  const updateEntry = async (entry) => {
    const updated = await updateMonitoringEntry(entry.id, entry);
    setEntries((prev) => prev.map((e) => (e.id === updated.id ? updated : e)));
  };

  const deleteEntry = async (id) => {
    await deleteMonitoringEntry(id);
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
    throw new Error("useMonitoring must be used inside MonitoringProvider");
  }
  return ctx;
}
