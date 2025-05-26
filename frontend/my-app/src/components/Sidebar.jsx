// src/components/Sidebar.jsx
import React, { useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Activity,
  BarChart2,
  Clock,
  DollarSign,
  Settings,
  User as UserIcon,
  LogOut,
  X,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { useAuth } from "../contexts/AuthContext.jsx";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "../components/ui/dialog";
import { Button } from "../components/ui/button";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const menuItems = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Басты бет" },
  { to: "/monitoring", icon: Activity, label: "Мониторинг" },
  { to: "/analytics/upload", icon: BarChart2, label: "Аналитика" },
  { to: "/history", icon: Clock, label: "Дерек тарихы" },
  { to: "/finance", icon: DollarSign, label: "Қаражаттар" },
  // Добавили новый пункт
  { to: "/users", icon: UserIcon, label: "Қолданушылар" },
  { to: "/settings", icon: Settings, label: "Жүйені баптау" },
];

export default function Sidebar({ isOpen, toggleSidebar }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isDialogOpen, setDialogOpen] = useState(false);

  // Определяем активный пункт
  const activeIndex = menuItems.findIndex(({ to }) =>
    to === "/analytics/upload"
      ? location.pathname.startsWith("/analytics")
      : location.pathname === to
  );

  const initial = { opacity: 0, x: -20 };
  const animate = { opacity: 1, x: 0 };
  const transition = { type: "spring", stiffness: 300, damping: 30 };

  const handleLogout = async () => {
    setDialogOpen(false);
    await logout();
    toast.success("Сәтті шықтыңыз");
    navigate("/", { replace: true });
  };

  const avatarUrl =
    user?.avatar_url ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      user?.fullname || "?"
    )}&background=4f46e5&color=fff`;

  return (
    <>
      <aside
        className={`fixed md:sticky top-0 left-0 z-40 h-screen 
          ${isOpen ? "w-64" : "w-20"}
          bg-gradient-to-b from-indigo-50 to-white
          dark:from-gray-900 dark:to-gray-800
          flex flex-col
          border-r border-gray-200 dark:border-gray-700
          transition-all duration-300
        `}
      >
        {/* Mobile toggle */}
        <div className="flex justify-end p-4 md:hidden">
          <motion.button
            onClick={toggleSidebar}
            whileTap={{ scale: 0.9 }}
            className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            type="button"
          >
            <X className="w-6 h-6" />
          </motion.button>
        </div>

        {/* Logo */}
        <motion.div
          initial={initial}
          animate={animate}
          transition={{ ...transition, delay: 0.1 }}
          className={`${
            isOpen ? "px-6" : "px-0"
          } pt-12 pb-4 border-b border-gray-200 dark:border-gray-700`}
        >
          <div className={isOpen ? "text-left" : "flex justify-center"}>
            <h1 className="text-2xl font-extrabold tracking-tight text-indigo-600 dark:text-indigo-400 whitespace-nowrap">
              BCD
            </h1>
          </div>
        </motion.div>

        {/* Avatar & Name */}
        <motion.div
          initial={initial}
          animate={animate}
          transition={{ ...transition, delay: 0.15 }}
          className={`${
            isOpen ? "px-6" : "px-0"
          } pt-4 pb-4 border-b border-gray-200 dark:border-gray-700`}
        >
          <div
            className={
              isOpen ? "flex items-center space-x-3" : "flex justify-center"
            }
          >
            <Avatar className="w-12 h-12 border-2 border-indigo-500">
              {avatarUrl ? (
                <AvatarImage
                  src={`http://localhost:8000${avatarUrl}`}
                  alt={user?.fullname || "User"}
                />
              ) : null}
              <AvatarFallback>
                {user?.fullname?.[0]?.toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            {isOpen && (
              <div className="overflow-hidden leading-tight">
                <p className="text-sm font-medium text-gray-800 dark:text-gray-100">
                  {user?.fullname || "Гость"}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {user?.role || "User"}
                </p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Menu */}
        <nav className="relative flex-1 px-2 mt-4">
          {activeIndex >= 0 && (
            <motion.div
              layoutId="sidebar-indicator"
              className="absolute left-0 w-1 bg-indigo-600 rounded-r"
              style={{ top: `${activeIndex * 48}px`, height: "48px" }}
              transition={{ type: "spring", stiffness: 500, damping: 40 }}
            />
          )}
          {menuItems.map(({ to, icon: Icon, label }) => {
            const isActive =
              to === "/analytics/upload"
                ? location.pathname.startsWith("/analytics")
                : location.pathname === to;
            return (
              <NavLink
                key={to}
                to={to}
                title={!isOpen ? label : undefined}
                onClick={() => window.innerWidth < 768 && toggleSidebar()}
                className="relative block"
              >
                <motion.div
                  initial="rest"
                  animate={isActive ? "hover" : "rest"}
                  whileHover="hover"
                  variants={{
                    rest: { backgroundColor: "transparent" },
                    hover: { backgroundColor: "rgba(99,102,241,0.2)" },
                  }}
                  className={`flex items-center h-12 ${
                    isOpen ? "px-4" : "justify-center"
                  } rounded-lg transition-colors ${
                    isActive
                      ? "bg-indigo-200 dark:bg-indigo-800 border-l-4 border-indigo-600"
                      : ""
                  }`}
                >
                  <Icon
                    className={`w-6 h-6 flex-shrink-0 ${
                      isActive
                        ? "text-indigo-600"
                        : "text-gray-600 dark:text-gray-300"
                    }`}
                  />
                  {isOpen && (
                    <span
                      className={`ml-3 text-sm font-medium truncate ${
                        isActive
                          ? "text-indigo-700 dark:text-indigo-300"
                          : "text-gray-700 dark:text-gray-200"
                      }`}
                    >
                      {label}
                    </span>
                  )}
                </motion.div>
              </NavLink>
            );
          })}
        </nav>

        <div className="border-t border-gray-200 dark:border-gray-700 mt-6" />

        {/* Profile / Logout */}
        <div className="mt-auto px-4 pb-6">
          <nav className="space-y-1">
            <NavLink
              to="/profile"
              title={!isOpen ? "Профиль" : undefined}
              onClick={() => window.innerWidth < 768 && toggleSidebar()}
              className="block"
            >
              <motion.div
                initial="rest"
                whileHover="hover"
                variants={{
                  rest: { backgroundColor: "transparent" },
                  hover: { backgroundColor: "rgba(99,102,241,0.2)" },
                }}
                className={`flex items-center h-12 ${
                  isOpen ? "px-4" : "justify-center"
                } rounded-lg transition-colors`}
              >
                <UserIcon className="w-6 h-6 text-gray-600 dark:text-gray-300 flex-shrink-0" />
                {isOpen && (
                  <span className="ml-3 text-sm text-gray-700 dark:text-gray-200 truncate">
                    Профиль
                  </span>
                )}
              </motion.div>
            </NavLink>
            <button
              onClick={() => setDialogOpen(true)}
              type="button"
              title={!isOpen ? "Шығу" : undefined}
              className={`w-full flex items-center h-12 ${
                isOpen ? "px-4 justify-start" : "justify-center"
              } rounded-lg transition-colors text-gray-600 dark:text-gray-300 hover:bg-[rgba(239,68,68,0.2)]`}
            >
              <LogOut className="w-6 h-6 text-red-600 flex-shrink-0" />
              {isOpen && (
                <span className="ml-3 text-sm text-gray-700 dark:text-gray-200 truncate">
                  Шығу
                </span>
              )}
            </button>
          </nav>
        </div>
      </aside>

      {/* Диалог подтверждения выхода */}
      <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg max-w-sm mx-auto">
          <DialogHeader>
            <DialogTitle>Аккаунттан шығу</DialogTitle>
            <DialogDescription>
              Сіз шынымен аккаунттан шығасыз ба?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-center space-x-4 pt-4">
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Жоқ
            </Button>
            <Button
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={handleLogout}
            >
              Иә
            </Button>
          </DialogFooter>
          <DialogClose className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
        </DialogContent>
      </Dialog>
    </>
  );
}
