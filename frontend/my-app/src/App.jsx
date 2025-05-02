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
import Monitoring from "./pages/Monitoring.jsx";
import Finance from "./pages/Finance.jsx";
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

  // global settings for Settings page
  const [settings, setSettings] = useState({
    idleTimeout: 15,
    fontFamily: "sans-serif",
    language: "ru",
    fontSize: 16,
    highContrast: false,
    theme: "light",
    accentColor: "#4f46e5",
  });

  // load saved settings
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("settings") || "{}");
    setSettings((s) => ({ ...s, ...saved }));
  }, []);

  // apply & persist settings
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

        {/* 2) Private layout */}
        <Route
          path="/*"
          element={
            <PrivateLayout
              isOpen={isSidebarOpen}
              toggleSidebar={toggleSidebar}
            />
          }
        >
          {/* default */}
          <Route index element={<Navigate to="dashboard" replace />} />

          <Route path="dashboard" element={<Dashboard />} />
          <Route path="monitoring" element={<Monitoring />} />
          <Route path="finance" element={<Finance />} />

          <Route path="analytics">
            <Route index element={<Navigate to="upload" replace />} />
            <Route path="upload" element={<AnalyticsUpload />} />
            <Route path="filter" element={<AnalyticsFilter />} />
            <Route path="visualize" element={<AnalyticsVisualize />} />
          </Route>

          <Route path="history" element={<History />} />
          <Route
            path="settings"
            element={<Settings settings={settings} setSettings={setSettings} />}
          />
          <Route path="profile" element={<Profile />} />
        </Route>

        {/* 3) Fallback → Landing */}
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
