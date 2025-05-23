// src/api/monitoring.js
import API from "./axios";

// Барлық жазбаларды алу
export const fetchMonitoringData = async () => {
  const res = await API.get("/equipment/");
  return res.data;
};

// Жазба қосу
export const createMonitoringEntry = async (data) => {
  const res = await API.post("/equipment/", data);
  return res.data;
};

// Жаңарту
export const updateMonitoringEntry = async (id, data) => {
  const res = await API.put(`/equipment/${id}`, data);
  return res.data;
};

// Жою
export const deleteMonitoringEntry = async (id) => {
  const res = await API.delete(`/equipment/${id}`);
  return res.data;
};
