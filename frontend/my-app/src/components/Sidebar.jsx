import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  BarChart2,
  Calendar,
  Settings,
  User,
  LogOut,
  X,
} from "lucide-react";

export default function Sidebar({ isOpen, toggleSidebar }) {
  return (
    <aside
      className={`fixed top-0 left-0 z-40 h-full w-64 bg-white dark:bg-gray-900 shadow-lg transform ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } transition-transform duration-300 ease-in-out md:static md:translate-x-0`}
    >
      {/* Кнопка закрытия для мобильных */}
      <div className="flex justify-end p-4 md:hidden">
        <button
          onClick={toggleSidebar}
          className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Верхняя часть — логотип и меню */}
      <div>
        <div className="p-6 text-2xl font-bold text-gray-800 dark:text-white">
          Dashboard
        </div>

        <nav className="flex flex-col space-y-1 px-4">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `flex items-center px-3 py-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition ${
                isActive
                  ? "bg-gray-100 dark:bg-gray-800 text-black dark:text-white font-semibold"
                  : ""
              }`
            }
          >
            <LayoutDashboard className="w-5 h-5 mr-3" />
            Главная панель
          </NavLink>

          <NavLink
            to="/analytics"
            className={({ isActive }) =>
              `flex items-center px-3 py-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition ${
                isActive
                  ? "bg-gray-100 dark:bg-gray-800 text-black dark:text-white font-semibold"
                  : ""
              }`
            }
          >
            <BarChart2 className="w-5 h-5 mr-3" />
            Аналитика
          </NavLink>

          <NavLink
            to="/history"
            className={({ isActive }) =>
              `flex items-center px-3 py-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition ${
                isActive
                  ? "bg-gray-100 dark:bg-gray-800 text-black dark:text-white font-semibold"
                  : ""
              }`
            }
          >
            <Calendar className="w-5 h-5 mr-3" />
            История данных
          </NavLink>

          <NavLink
            to="/settings"
            className={({ isActive }) =>
              `flex items-center px-3 py-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition ${
                isActive
                  ? "bg-gray-100 dark:bg-gray-800 text-black dark:text-white font-semibold"
                  : ""
              }`
            }
          >
            <Settings className="w-5 h-5 mr-3" />
            Настройка системы
          </NavLink>
        </nav>
      </div>

      {/* Нижняя часть — профиль и выход */}
      <div className="px-4 py-6 border-t border-gray-200 dark:border-gray-700 mt-auto">
        <nav className="flex flex-col space-y-1">
          <NavLink
            to="/profile"
            className={({ isActive }) =>
              `flex items-center px-3 py-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition ${
                isActive
                  ? "bg-gray-100 dark:bg-gray-800 text-black dark:text-white font-semibold"
                  : ""
              }`
            }
          >
            <User className="w-5 h-5 mr-3" />
            Профиль
          </NavLink>

          <button
            className="flex items-center px-3 py-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            onClick={() => alert("Вы успешно вышли!")}
          >
            <LogOut className="w-5 h-5 mr-3" />
            Выйти
          </button>
        </nav>

        <div className="mt-4 text-xs text-gray-400 dark:text-gray-500 text-center">
          © 2025 Диплом
        </div>
      </div>
    </aside>
  );
}
