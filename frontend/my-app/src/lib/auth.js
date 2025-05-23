// src/lib/auth.js
import API from "../api/axios";

// ✅ Регистрация
export const registerUser = async (formData) => {
  const res = await API.post("/users/register", formData);
  return res.data;
};

// ✅ Логин
export const loginUser = async ({ email, password }) => {
  const res = await API.post("/users/login", { email, password });
  const token = res.data.access_token;
  localStorage.setItem("token", token);
  return token;
};

// ✅ Получить текущего пользователя
export const getCurrentUser = async () => {
  const res = await API.get("/users/me");
  return res.data;
};

// ✅ Выход
export const logoutUser = () => {
  localStorage.removeItem("token");
};

export const updateCurrentUser = async (data) => {
  const res = await API.patch("/users/me", data);
  return res.data;
};

export const uploadAvatar = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const res = await API.post("/users/me/avatar", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data.avatar_url;
};
