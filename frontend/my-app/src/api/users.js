import API from "./axios.js";

export const getAllUsers = () => API.get("/users/all");

export const updateUserRole = (id, data) =>
  API.patch(`/users/${id}/update-role`, data);

export const deleteUser = (id) => API.delete(`/users/${id}`);
