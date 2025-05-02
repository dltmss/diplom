// src/pages/AnalyticsVisualize.jsx
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function AnalyticsVisualize() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { headers, filteredData } = state || {};

  if (!filteredData) {
    return (
      <div>
        Нет данных.{" "}
        <button onClick={() => navigate("/analytics/filter")}>
          Назад к фильтрации
        </button>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl mb-4">Шаг 3: Визуализация</h1>
      {/* твой Recharts / Chart.js */}
    </div>
  );
}
