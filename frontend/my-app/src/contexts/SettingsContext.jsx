// src/contexts/SettingsContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import i18n from "../i18n"; // инициализация i18next

const SettingsContext = createContext();

/**
 * SettingsProvider — хранит глобальные настройки, читает/записывает их
 * в localStorage, сразу же применяет:
 *  - CSS‑переменные (--font-family, --font-size-base, --accent-color)
 *  - классы dark / high‑contrast
 *  - атрибут lang у <html>
 *  - переключает язык i18next
 */
export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState({
    idleTimeout: 15,
    timeFormat: "24",
    fontFamily: "sans-serif",
    fontSize: 16,
    theme: "light",
    language: "ru",
    highContrast: false,
    accentColor: "#4f46e5",
  });

  // При монтировании — подгружаем сохранённые значения
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("settings") || "{}");
    setSettings((s) => ({ ...s, ...saved }));
  }, []);

  // При любом изменении settings:
  // 1) сохраняем в localStorage
  // 2) сразу же применяем все CSS‑переменные и классы
  // 3) переключаем язык i18next
  useEffect(() => {
    const { fontFamily, fontSize, theme, language, highContrast, accentColor } =
      settings;

    // CSS-переменные
    document.documentElement.style.setProperty("--font-family", fontFamily);
    document.documentElement.style.setProperty(
      "--font-size-base",
      `${fontSize}px`
    );
    document.documentElement.style.setProperty("--accent-color", accentColor);

    // Классы темы
    document.documentElement.classList.toggle("dark", theme === "dark");
    document.documentElement.classList.toggle("high-contrast", highContrast);

    // Атрибут языка
    document.documentElement.lang = language;

    // Переключение i18next
    i18n.changeLanguage(language);

    // Сохраняем настройки
    localStorage.setItem("settings", JSON.stringify(settings));
  }, [settings]);

  return (
    <SettingsContext.Provider value={{ settings, setSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}

/**
 * Хук useSettings() — возвращает { settings, setSettings }
 * и бросает ошибку, если его вызывают вне SettingsProvider.
 */
export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return ctx;
}
