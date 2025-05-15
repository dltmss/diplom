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

// i18n-config for react-i18next
import "./i18n";
import { useTranslation } from "react-i18next";

// our context providers
import { SettingsProvider, useSettings } from "./contexts/SettingsContext.jsx";
import { AuthProvider } from "./contexts/AuthContext.jsx";
import { MonitoringProvider } from "./contexts/MonitoringContext.jsx";
import { HistoryProvider } from "./contexts/HistoryContext.jsx";

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

// layout components
import Sidebar from "./components/Sidebar.jsx";
import Topbar from "./components/Topbar.jsx";

/**
 * The core of the app, where useSettings is already available
 */
function App() {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const toggleSidebar = () => setSidebarOpen((o) => !o);

  // pull current settings from context
  const { settings } = useSettings();
  const { i18n } = useTranslation();

  // on language change, update html lang and i18next
  useEffect(() => {
    document.documentElement.lang = settings.language;
    i18n.changeLanguage(settings.language);
  }, [settings.language, i18n]);

  return (
    <AuthProvider>
      <MonitoringProvider>
        <HistoryProvider>
          <Router>
            <Toaster position="top-right" />

            <Routes>
              {/* 1) Public pages */}
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* 2) Private layout */}
              <Route
                element={
                  <PrivateLayout
                    isOpen={isSidebarOpen}
                    toggleSidebar={toggleSidebar}
                  />
                }
              >
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="monitoring" element={<Monitoring />} />
                <Route path="finance" element={<Finance />} />
                <Route path="analytics/upload" element={<AnalyticsUpload />} />
                <Route path="analytics/filter" element={<AnalyticsFilter />} />
                <Route
                  path="analytics/visualize"
                  element={<AnalyticsVisualize />}
                />
                <Route path="history" element={<History />} />
                <Route path="settings" element={<Settings />} />
                <Route path="profile" element={<Profile />} />
              </Route>

              {/* 3) All others → landing */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Router>
        </HistoryProvider>
      </MonitoringProvider>
    </AuthProvider>
  );
}

/**
 * Private area layout with sidebar and topbar
 */
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

/**
 * Wrap everything in SettingsProvider at the very top level.
 * Export RootApp as the entry point.
 */
export default function RootApp() {
  return (
    <SettingsProvider>
      <App />
    </SettingsProvider>
  );
}
