// src/index.jsx
import React from "react";
import ReactDOM from "react-dom/client";

// ваш SettingsProvider, HistoryProvider и теперь ещё MonitoringProvider
import { SettingsProvider } from "./contexts/SettingsContext.jsx";
import { MonitoringProvider } from "./contexts/MonitoringContext.jsx";
import { HistoryProvider } from "./contexts/HistoryContext.jsx";

import App from "./App.jsx";
import "./styles/index.css";
import reportWebVitals from "./reportWebVitals.js";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <SettingsProvider>
      <HistoryProvider>
        <MonitoringProvider>
          <App />
        </MonitoringProvider>
      </HistoryProvider>
    </SettingsProvider>
  </React.StrictMode>
);

reportWebVitals();
