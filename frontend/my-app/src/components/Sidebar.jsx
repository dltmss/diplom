// src/components/Sidebar.jsx

import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  BarChart2,
  Calendar,
  Settings,
  User,
  LogOut,
  X,
} from "lucide-react";

const menuItems = [
  { to: "/", icon: LayoutDashboard, label: "Главная панель" },
  { to: "/analytics", icon: BarChart2, label: "Аналитика" },
  { to: "/history", icon: Calendar, label: "История данных" },
  { to: "/settings", icon: Settings, label: "Настройка системы" },
];

export default function Sidebar({ isOpen, toggleSidebar }) {
  const location = useLocation();

  const handleLinkClick = () => {
    if (window.innerWidth < 768) {
      toggleSidebar();
    }
  };

  return (
    <aside
      className={`fixed top-0 left-0 z-40 h-screen ${
        isOpen ? "w-64" : "w-20"
      } bg-white dark:bg-gray-900 transform transition-all duration-500 ease-in-out md:static md:translate-x-0 flex flex-col justify-between shadow-none`}
    >
      {/* Мобильная кнопка закрытия */}
      <div className="flex justify-end p-4 md:hidden">
        <button
          onClick={toggleSidebar}
          className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-transform duration-300 transform hover:scale-110"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Верхняя часть */}
      <div>
        <div
          className={`p-6 text-2xl font-bold text-gray-800 dark:text-white transition-all duration-300 ${
            !isOpen && "text-center p-2"
          }`}
        >
          {isOpen ? "Dashboard" : "D"}
        </div>

        <nav className="flex flex-col space-y-1 px-2">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.to;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={handleLinkClick}
                className={`flex items-center px-3 py-2 rounded-md text-gray-700 dark:text-gray-300 transition-all duration-300 ease-in-out group ${
                  isActive
                    ? "bg-gradient-to-r from-blue-500 to-blue-700 text-white font-semibold shadow-md"
                    : "hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                <item.icon className="w-5 h-5 mr-3 transition-transform duration-300 group-hover:scale-110" />
                <span
                  className={`transition-all duration-300 ease-in-out ${
                    isOpen ? "opacity-100" : "opacity-0 w-0 overflow-hidden"
                  } group-hover:translate-x-1`}
                >
                  {item.label}
                </span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Нижняя часть */}
      <div className="px-2 py-4 border-t border-gray-200 dark:border-gray-700">
        <nav className="flex flex-col space-y-1">
          <NavLink
            to="/profile"
            onClick={handleLinkClick}
            className={({ isActive }) =>
              `flex items-center px-3 py-2 rounded-md text-gray-700 dark:text-gray-300 transition-all duration-300 ease-in-out group ${
                isActive
                  ? "bg-gradient-to-r from-blue-500 to-blue-700 text-white font-semibold shadow-md"
                  : "hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
              }`
            }
          >
            <User className="w-5 h-5 mr-3 transition-transform duration-300 group-hover:scale-110" />
            <span
              className={`transition-all duration-300 ease-in-out ${
                isOpen ? "opacity-100" : "opacity-0 w-0 overflow-hidden"
              } group-hover:translate-x-1`}
            >
              Профиль
            </span>
          </NavLink>

          <button
            onClick={() => {
              alert("Вы успешно вышли!");
              handleLinkClick();
            }}
            className="flex items-center px-3 py-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-red-100 dark:hover:bg-red-900 hover:text-red-600 dark:hover:text-red-400 transition-all duration-300 group"
          >
            <LogOut className="w-5 h-5 mr-3 transition-transform duration-300 group-hover:scale-110" />
            <span
              className={`transition-all duration-300 ease-in-out ${
                isOpen ? "opacity-100" : "opacity-0 w-0 overflow-hidden"
              } group-hover:translate-x-1`}
            >
              Выйти
            </span>
          </button>
        </nav>
      </div>
    </aside>
  );
}
