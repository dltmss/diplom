// src/index.jsx
import React from "react";
import ReactDOM from "react-dom/client";

// 1) Инициализируем i18next сразу, до App
import "./i18n";

// 2) Провайдер настроек
import { SettingsProvider } from "./contexts/SettingsContext.jsx";

// 3) Ваше приложение
import App from "./App.jsx";

// 4) Стили, метрики
import "./styles/index.css";
import reportWebVitals from "./reportWebVitals.js";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <SettingsProvider>
      <App />
    </SettingsProvider>
  </React.StrictMode>
);

// Опционально: замер производительности
reportWebVitals();
