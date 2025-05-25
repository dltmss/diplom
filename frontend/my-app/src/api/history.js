// src/api/history.js
import API from "./axios";

// 1) Получить все логи с бэка (с поддержкой фильтров)
export async function fetchLogs({ search, start, end, types } = {}) {
  const params = {};
  if (search) params.search = search;
  if (start) params.start = start;
  if (end) params.end = end;
  if (types && types.length) params.types = types.join(",");
  const res = await API.get("/logs/", { params });
  return res.data;
}

// 2) Создать новый лог
export async function createLog(payload) {
  const res = await API.post("/logs/", payload);
  return res.data;
}

// 3) Удалить один лог по id
export async function deleteLog(id) {
  await API.delete(`/logs/${id}`);
}

// 4) Очистить все логи
export async function clearHistory() {
  await API.delete("/logs/");
}
