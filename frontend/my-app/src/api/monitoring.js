// src/api/monitoring.js
import API from "./axios";

// Получить все записи
export const fetchMonitoringData = async () => {
  const res = await API.get("/equipment/");
  return res.data;
};

// Создать новую запись
export const createMonitoringEntry = async (data) => {
  const res = await API.post("/equipment/", data);
  return res.data;
};

// Обновить запись
export const updateMonitoringEntry = async (id, data) => {
  const res = await API.put(`/equipment/${id}`, data);
  return res.data;
};

// Удалить запись
export const deleteMonitoringEntry = async (id) => {
  const res = await API.delete(`/equipment/${id}`);
  return res.data;
};
