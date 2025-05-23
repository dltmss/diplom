import React, { createContext, useContext, useState, useEffect } from "react";
import {
  fetchMonitoring,
  createMonitoring,
  updateMonitoring,
  deleteMonitoring,
} from "@/lib/api";

const MonitoringContext = createContext(null);

export function MonitoringProvider({ children }) {
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    (async () => {
      const data = await fetchMonitoring();
      setEntries(data);
    })();
  }, []);

  const addEntry = async (entry) => {
    const newEntry = await createMonitoring(entry);
    setEntries((prev) => [...prev, newEntry]);
  };

  const updateEntry = async (entry) => {
    const updated = await updateMonitoring(entry.id, entry);
    setEntries((prev) => prev.map((e) => (e.id === updated.id ? updated : e)));
  };

  const deleteEntry = async (id) => {
    await deleteMonitoring(id);
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
