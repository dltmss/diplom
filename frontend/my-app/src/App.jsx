// src/App.jsx
import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Landing from "./pages/Landing.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";

import Dashboard from "./pages/Dashboard.jsx";
import Analytics from "./pages/Analytics.jsx";
import History from "./pages/History.jsx";
import Settings from "./pages/Settings.jsx";
import Profile from "./pages/Profile.jsx";

import Sidebar from "./components/Sidebar.jsx";
import Topbar from "./components/Topbar.jsx";

export default function App() {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const toggleSidebar = () => setSidebarOpen((o) => !o);

  // Пример: общие настройки (если нужны)
  const [settings, setSettings] = useState({
    idleTimeout: 15,
    fontFamily: "sans-serif",
    language: "ru",
    fontSize: 16,
    highContrast: false,
    theme: "light",
    accentColor: "#4f46e5",
  });

  // При монтировании считываем настройки
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("settings") || "{}");
    setSettings((s) => ({ ...s, ...saved }));
  }, []);

  // Применяем и сохраняем
  useEffect(() => {
    const { fontFamily, fontSize, highContrast, theme, language, accentColor } =
      settings;
    document.documentElement.style.setProperty("--font-family", fontFamily);
    document.documentElement.style.setProperty(
      "--font-size-base",
      `${fontSize}px`
    );
    document.documentElement.classList.toggle("high-contrast", highContrast);
    document.documentElement.classList.toggle("dark", theme === "dark");
    document.documentElement.lang = language;
    document.documentElement.style.setProperty("--accent-color", accentColor);
    localStorage.setItem("settings", JSON.stringify(settings));
  }, [settings]);

  return (
    <Router>
      <Toaster position="top-right" />

      <Routes>
        {/* Public */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected */}
        <Route
          element={
            <PrivateLayout
              isOpen={isSidebarOpen}
              toggleSidebar={toggleSidebar}
            />
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/history" element={<History />} />
          <Route
            path="/settings"
            element={<Settings settings={settings} setSettings={setSettings} />}
          />
          <Route path="/profile" element={<Profile />} />
        </Route>

        {/* Все остальные — на главную */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

// Layout для защищённых страниц
function PrivateLayout({ isOpen, toggleSidebar }) {
  return (
    <div className="flex">
      <Sidebar isOpen={isOpen} toggleSidebar={toggleSidebar} />

      <main className="flex-1 bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-300">
        <Topbar toggleSidebar={toggleSidebar} />
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
