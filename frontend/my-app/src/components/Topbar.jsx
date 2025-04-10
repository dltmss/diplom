import React, { useState, useEffect } from "react";
import { Bell, Moon, Sun, User } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function Topbar() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const html = document.documentElement;
    if (isDarkMode) {
      html.classList.add("dark");
    } else {
      html.classList.remove("dark");
    }
  }, [isDarkMode]);

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-white dark:bg-gray-800 shadow transition-colors duration-300">
      {/* Название панели */}
      <div className="text-xl font-bold text-gray-800 dark:text-white transition-colors duration-300">
        Dashboard
      </div>

      {/* Поиск */}
      <div className="flex-1 mx-4">
        <Input
          type="text"
          placeholder="Поиск..."
          className="max-w-md bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400 border-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
        />
      </div>

      {/* Иконки справа */}
      <div className="flex items-center space-x-4">
        {/* Уведомления */}
        <button className="relative text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors duration-300">
          <Bell className="w-5 h-5" />
          {/* Индикатор уведомлений */}
          <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-gray-800 animate-ping" />
          <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-gray-800" />
        </button>

        {/* Переключатель темы */}
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors duration-300"
        >
          {isDarkMode ? (
            <Sun className="w-5 h-5" />
          ) : (
            <Moon className="w-5 h-5" />
          )}
        </button>

        {/* Профиль пользователя */}
        <button className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors duration-300">
          <User className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
}
