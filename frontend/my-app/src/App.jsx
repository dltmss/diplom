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

// public pages
import Landing from "./pages/Landing.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";

// private pages
import Dashboard from "./pages/Dashboard.jsx";
import AnalyticsUpload from "./pages/AnalyticsUpload.jsx";
import AnalyticsFilter from "./pages/AnalyticsFilter.jsx";
import AnalyticsVisualize from "./pages/AnalyticsVisualize.jsx";
import History from "./pages/History.jsx";
import Settings from "./pages/Settings.jsx";
import Profile from "./pages/Profile.jsx";

import Sidebar from "./components/Sidebar.jsx";
import Topbar from "./components/Topbar.jsx";

export default function App() {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const toggleSidebar = () => setSidebarOpen((o) => !o);

  // глобальные настройки для Settings.jsx
  const [settings, setSettings] = useState({
    idleTimeout: 15,
    fontFamily: "sans-serif",
    language: "ru",
    fontSize: 16,
    highContrast: false,
    theme: "light",
    accentColor: "#4f46e5",
  });

  // загружаем из localStorage
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("settings") || "{}");
    setSettings((s) => ({ ...s, ...saved }));
  }, []);

  // применяем + сохраняем обратно
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
        {/* 1) Public */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* 2) PrivateLayout для всех остальных */}
        <Route
          path="/*"
          element={
            <PrivateLayout
              isOpen={isSidebarOpen}
              toggleSidebar={toggleSidebar}
            />
          }
        >
          <Route path="dashboard" element={<Dashboard />} />

          <Route path="analytics">
            <Route path="upload" element={<AnalyticsUpload />} />
            <Route path="filter" element={<AnalyticsFilter />} />
            <Route path="visualize" element={<AnalyticsVisualize />} />
          </Route>

          <Route path="history" element={<History />} />

          {/* Передаём props в Settings */}
          <Route
            path="settings"
            element={<Settings settings={settings} setSettings={setSettings} />}
          />

          <Route path="profile" element={<Profile />} />
        </Route>

        {/* 3) Всё, что не попало выше — на лэндинг */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

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
