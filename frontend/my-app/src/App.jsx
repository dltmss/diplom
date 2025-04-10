import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Analytics from "./pages/Analytics";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";

export default function App() {
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  return (
    <Router>
      <div className="flex">
        {/* Sidebar */}
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

        {/* Основной контент */}
        <main className="flex-1 bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-300">
          {/* Topbar с кнопкой для открытия Sidebar */}
          <Topbar toggleSidebar={toggleSidebar} />

          {/* Контент страниц */}
          <div className="p-6">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/analytics" element={<Analytics />} />
              {/* Можем добавить ещё другие страницы, например: история, настройки */}
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  );
}
