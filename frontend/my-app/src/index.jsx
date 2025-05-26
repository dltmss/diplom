// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./styles/index.css";

// Контекст-провайдеры
import { SettingsProvider } from "./contexts/SettingsContext.jsx";
import { AuthProvider } from "./contexts/AuthContext.jsx";
import { HistoryProvider } from "./contexts/HistoryContext.jsx";
import { MonitoringProvider } from "./contexts/MonitoringContext.jsx";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <SettingsProvider>
      <AuthProvider>
        <MonitoringProvider>
          <HistoryProvider>
            <App />
          </HistoryProvider>
        </MonitoringProvider>
      </AuthProvider>
    </SettingsProvider>
  </React.StrictMode>
);
