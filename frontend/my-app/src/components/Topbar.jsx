// src/components/Topbar.jsx
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Menu, Moon, Sun } from "lucide-react";

export default function Topbar({ toggleSidebar }) {
  const location = useLocation();

  // тема
  const [isDarkMode, setIsDarkMode] = useState(() =>
    document.documentElement.classList.contains("dark")
  );
  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDarkMode);
  }, [isDarkMode]);

  // динамический заголовок
  const titles = {
    "/dashboard": "Басты бет",
    "/monitoring": "Мониторинг",
    "/analytics": "Аналитика",
    "/history": "Дерек тарихы",
    "/finance": "Қаражаттар",
    "/settings": "Жүйені баптау",
    "/profile": "Профиль",
    "/users": "Қолданушылар", // <-- добавили поддержку страницы пользователей
  };
  const currentTitle =
    Object.entries(titles).find(([path]) =>
      location.pathname.startsWith(path)
    )?.[1] || "";

  return (
    <header
      className="
        flex items-center justify-between
        px-8 py-3
        bg-gradient-to-r from-indigo-50 to-white dark:from-gray-900 dark:to-gray-800
        border-b border-gray-200 dark:border-gray-700
        shadow-lg
        transition-colors duration-300
      "
    >
      {/* Sidebar toggle */}
      <button
        onClick={toggleSidebar}
        type="button"
        className="
          p-2 bg-white dark:bg-gray-700
          rounded-full
          shadow hover:shadow-xl
          transition-shadow duration-200
        "
      >
        <Menu className="w-6 h-6 text-indigo-600 dark:text-indigo-300" />
      </button>

      {/* Centered title with pill */}
      <div className="flex-1 flex justify-center">
        <span
          className="
            px-5 py-1
            bg-indigo-100 dark:bg-indigo-700
            text-indigo-700 dark:text-indigo-200
            font-semibold text-lg
            rounded-full
            transition-colors duration-300
          "
        >
          {currentTitle}
        </span>
      </div>

      {/* Theme switch */}
      <button
        onClick={() => setIsDarkMode((m) => !m)}
        type="button"
        className="
          p-2 bg-white dark:bg-gray-700
          rounded-full
          shadow hover:shadow-xl
          transition-shadow duration-200
        "
      >
        {isDarkMode ? (
          <Sun className="w-6 h-6 text-yellow-400" />
        ) : (
          <Moon className="w-6 h-6 text-gray-600" />
        )}
      </button>
    </header>
  );
}
