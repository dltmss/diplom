// src/api/finance.js
import API from "./axios";

// Получить все записи (с фильтрами в query)
export const fetchFinance = async ({ start, end, device, search } = {}) => {
  const params = {};
  if (start) params.start = start;
  if (end) params.end = end;
  if (device) params.device = device;
  if (search) params.search = search;

  const res = await API.get("/finance", { params });
  return res.data;
};

// Создать запись
export const createFinance = async (data) => {
  const res = await API.post("/finance", data);
  return res.data;
};

// Обновить запись
export const updateFinance = async (id, data) => {
  const res = await API.put(`/finance/${id}`, data);
  return res.data;
};

// Удалить запись
export const deleteFinance = async (id) => {
  const res = await API.delete(`/finance/${id}`);
  return res.data;
};
