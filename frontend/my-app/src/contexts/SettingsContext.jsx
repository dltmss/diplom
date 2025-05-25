import React, { createContext, useContext, useState, useEffect } from "react";
import i18n from "../i18n"; // если не используете — можно закомментировать

const SettingsContext = createContext();

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

  // Загружаем из localStorage при старте
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("settings") || "{}");
    setSettings((s) => ({ ...s, ...saved }));
  }, []);

  // При каждом изменении settings — применяем сразу
  useEffect(() => {
    const { fontFamily, fontSize, theme, language, highContrast, accentColor } =
      settings;

    // Устанавливаем CSS-переменные
    document.documentElement.style.setProperty("--font-family", fontFamily);
    document.documentElement.style.setProperty(
      "--font-size-base",
      `${fontSize}px`
    );
    document.documentElement.style.setProperty("--accent-color", accentColor);

    // Тема
    document.documentElement.classList.toggle("dark", theme === "dark");
    document.documentElement.classList.toggle("high-contrast", highContrast);

    // Язык у корневого <html>
    document.documentElement.lang = language;
    // i18n.changeLanguage(language); // если используете i18next

    // Сохраняем в localStorage
    localStorage.setItem("settings", JSON.stringify(settings));
  }, [settings]);

  return (
    <SettingsContext.Provider value={{ settings, setSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return ctx;
}
