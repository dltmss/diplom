import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Analytics from "./pages/Analytics";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Landing from "./pages/Landing";
import { Toaster } from "react-hot-toast";

export default function App() {
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  return (
    <Router>
      {/* Toaster для уведомлений */}
      <Toaster position="top-right" reverseOrder={false} />

      <Routes>
        {/* Публичные маршруты без Sidebar и Topbar */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Основной макет с Sidebar и Topbar */}
        <Route
          path="/*"
          element={
            <div className="flex">
              {/* Sidebar */}
              <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

              {/* Main content */}
              <main className="flex-1 bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-300">
                {/* Topbar */}
                <Topbar toggleSidebar={toggleSidebar} />

                {/* Page content */}
                <div className="p-6">
                  <Routes>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/analytics" element={<Analytics />} />
                    {/* Добавишь новые страницы сюда */}
                  </Routes>
                </div>
              </main>
            </div>
          }
        />
      </Routes>
    </Router>
  );
}
