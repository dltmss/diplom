// src/contexts/FinanceContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import {
  fetchFinance,
  createFinance,
  updateFinance,
  deleteFinance,
} from "../api/finance.js";

const FinanceContext = createContext();

export function FinanceProvider({ children }) {
  const [entries, setEntries] = useState([]);

  // При загрузке приложения — подгружаем все записи
  useEffect(() => {
    (async () => {
      try {
        const data = await fetchFinance(); // без фильтров
        setEntries(data);
      } catch (err) {
        console.error("Не удалось загрузить finance:", err);
      }
    })();
  }, []);

  // Создать
  const addEntry = async (entry) => {
    const created = await createFinance(entry);
    setEntries((prev) => [...prev, created]);
  };

  // Обновить
  const updateEntry = async (id, entry) => {
    const updated = await updateFinance(id, entry);
    setEntries((prev) => prev.map((e) => (e.id === updated.id ? updated : e)));
  };

  // Удалить
  const deleteEntry = async (id) => {
    await deleteFinance(id);
    setEntries((prev) => prev.filter((e) => e.id !== id));
  };

  return (
    <FinanceContext.Provider
      value={{ entries, addEntry, updateEntry, deleteEntry }}
    >
      {children}
    </FinanceContext.Provider>
  );
}

export function useFinance() {
  const ctx = useContext(FinanceContext);
  if (!ctx) {
    throw new Error("useFinance must be used inside a FinanceProvider");
  }
  return ctx;
}
