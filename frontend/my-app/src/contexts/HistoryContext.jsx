// src/contexts/HistoryContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext.jsx";
import {
  fetchLogs,
  createLog,
  deleteLog,
  clearHistory,
} from "../api/history.js";

const HistoryContext = createContext(null);

export function HistoryProvider({ children }) {
  const { user: currentUser } = useAuth();
  const [events, setEvents] = useState([]);

  // 1) Загружаем логи из базы при старте
  useEffect(() => {
    (async () => {
      try {
        const data = await fetchLogs();
        setEvents(data);
      } catch (err) {
        console.error("Не удалось загрузить логи:", err);
      }
    })();
  }, []);

  // 2) Добавление нового лога
  const addEvent = async ({ type, params = {}, file = "" }) => {
    if (!currentUser) return;
    try {
      const saved = await createLog({
        action: type,
        parameter: params,
        file_name: file,
      });
      setEvents((prev) => [saved, ...prev]);
    } catch (err) {
      console.error("Не удалось сохранить лог:", err);
    }
  };

  // 3) Удаление одного лога
  const deleteEvent = async (id) => {
    try {
      await deleteLog(id);
      setEvents((prev) => prev.filter((e) => e.id !== id));
    } catch (err) {
      console.error("Не удалось удалить лог:", err);
    }
  };

  // 4) Очистить все логи
  const clearAll = async () => {
    try {
      await clearHistory();
      setEvents([]);
    } catch (err) {
      console.error("Не удалось очистить логи:", err);
    }
  };

  return (
    <HistoryContext.Provider
      value={{ events, addEvent, deleteEvent, clearHistory: clearAll }}
    >
      {children}
    </HistoryContext.Provider>
  );
}

export function useHistoryLog() {
  const ctx = useContext(HistoryContext);
  if (!ctx)
    throw new Error("useHistoryLog must be used within HistoryProvider");
  return ctx;
}
