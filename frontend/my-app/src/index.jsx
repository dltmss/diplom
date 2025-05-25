import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./styles/index.css";

import { SettingsProvider } from "./contexts/SettingsContext.jsx";
import { AuthProvider } from "./contexts/AuthContext.jsx";
import { HistoryProvider } from "./contexts/HistoryContext.jsx";
import { MonitoringProvider } from "./contexts/MonitoringContext.jsx";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <SettingsProvider>
      <AuthProvider>
        <HistoryProvider>
          <MonitoringProvider>
            <App />
          </MonitoringProvider>
        </HistoryProvider>
      </AuthProvider>
    </SettingsProvider>
  </React.StrictMode>
);
