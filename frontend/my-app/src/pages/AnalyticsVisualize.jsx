// src/pages/AnalyticsVisualize.jsx
import React, { useState, useEffect, useMemo, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import html2canvas from "html2canvas";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  ScatterChart,
  Scatter,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Brush,
  ResponsiveContainer,
} from "recharts";
import {
  Download,
  FileText,
  ActivityIcon,
  BarChart2,
  RefreshCw,
} from "lucide-react";
import { useHistoryLog } from "../contexts/HistoryContext";

export default function AnalyticsVisualize() {
  const navigate = useNavigate();
  const { addEvent } = useHistoryLog();
  const { state } = useLocation();
  const {
    headers = [],
    data = [],
    metrics = [], // выбранные столбцы
  } = state || {};

  // Если нет данных, переадресуем на Upload
  useEffect(() => {
    if (!headers.length || !data.length || !metrics.length) {
      navigate("/analytics/upload", { replace: true });
    }
  }, [headers, data, metrics, navigate]);

  // Опции осей
  const xOptions = headers;
  const yOptions = metrics;

  // Типы графиков
  const CHART_TYPES = [
    { key: "line", icon: <ActivityIcon size={16} />, label: "Линейный" },
    { key: "bar", icon: <BarChart2 size={16} />, label: "Столбчатый" },
    { key: "area", icon: <ActivityIcon size={16} />, label: "Площадной" },
    { key: "scatter", icon: <ActivityIcon size={16} />, label: "Точечный" },
  ];

  // Состояние контролов
  const [chartType, setChartType] = useState("line");
  const [xAxisKey, setXAxisKey] = useState(xOptions[0] || "");
  const [yAxisKeys, setYAxisKeys] = useState(yOptions.slice());

  // Для локального отладки (необязательно)
  const [historyLog, setHistoryLog] = useState([]);
  const logAction = (action) =>
    setHistoryLog((h) => [...h, { time: new Date(), action }]);

  // Подготавливаем данные для графика
  const chartData = useMemo(
    () =>
      data.map((row) =>
        headers.reduce((obj, h, i) => {
          obj[h] = row[i];
          return obj;
        }, {})
      ),
    [data, headers]
  );

  // Ссылка на контейнер графика
  const chartRef = useRef(null);
  const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"];

  // Экспорт в PNG
  const exportPNG = async () => {
    if (!chartRef.current) return;
    const canvas = await html2canvas(chartRef.current, {
      backgroundColor: "#fff",
    });
    const url = canvas.toDataURL("image/png");
    const filename = `chart_${Date.now()}.png`;
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();

    // Добавляем событие в общий журнал
    addEvent({
      type: "Export PNG",
      params: { chart: chartType, x: xAxisKey, y: yAxisKeys },
      file: filename,
    });
    logAction("Экспорт PNG");
  };

  // Экспорт в CSV
  const exportCSV = () => {
    if (!chartData.length) return;
    const headerLine = [xAxisKey, ...yAxisKeys].join(",");
    const rows = chartData.map((r) =>
      [r[xAxisKey], ...yAxisKeys.map((k) => r[k])].join(",")
    );
    const csv = [headerLine, ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const filename = `data_${Date.now()}.csv`;
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);

    addEvent({
      type: "Export CSV",
      params: { chart: chartType, x: xAxisKey, y: yAxisKeys },
      file: filename,
    });
    logAction("Экспорт CSV");
  };

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8">
      {/* Шаги */}
      <div className="flex items-center">
        {["Жүктеу", "Сүзу", "Визуалдау"].map((label, idx) => (
          <React.Fragment key={idx}>
            <div className="flex items-center">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-semibold ${
                  idx === 2
                    ? "bg-[var(--accent-color)] text-white"
                    : "bg-gray-300 text-gray-700"
                }`}
              >
                {idx + 1}
              </div>
              <span
                className={`ml-2 ${
                  idx === 2
                    ? "text-[var(--accent-color)] font-medium"
                    : "text-gray-600"
                }`}
              >
                {label}
              </span>
            </div>
            {idx < 2 && <div className="flex-1 h-px bg-gray-300 mx-4" />}
          </React.Fragment>
        ))}
      </div>

      <div className="flex gap-6">
        {/* Панель параметров */}
        <Card className="w-1/4 shadow rounded-lg">
          <CardHeader>
            <CardTitle className="text-sm font-medium">Параметры</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Тип графика */}
            <div>
              <p className="text-xs font-medium mb-1">Тип графика</p>
              <div className="flex gap-2">
                {CHART_TYPES.map((t) => (
                  <button
                    key={t.key}
                    onClick={() => {
                      setChartType(t.key);
                      logAction(`Тип: ${t.label}`);
                    }}
                    className={`p-2 rounded-md flex-1 flex justify-center items-center text-xs ${
                      chartType === t.key
                        ? "bg-[var(--accent-color)] text-white"
                        : "bg-gray-100 text-gray-700"
                    }`}
                    title={t.label}
                  >
                    {t.icon}
                  </button>
                ))}
              </div>
            </div>
            {/* Ось X */}
            <div>
              <p className="text-xs font-medium mb-1">Ось X</p>
              <select
                value={xAxisKey}
                onChange={(e) => {
                  setXAxisKey(e.target.value);
                  logAction(`Ось X: ${e.target.value}`);
                }}
                className="w-full border rounded p-1 text-xs"
              >
                {xOptions.map((h) => (
                  <option key={h} value={h}>
                    {h}
                  </option>
                ))}
              </select>
            </div>
            {/* Ось Y */}
            <div>
              <p className="text-xs font-medium mb-1">Ось Y</p>
              <select
                multiple
                value={yAxisKeys}
                onChange={(e) => {
                  const opts = Array.from(
                    e.target.selectedOptions,
                    (o) => o.value
                  );
                  setYAxisKeys(opts);
                  logAction(`Ось Y: ${opts.join(",")}`);
                }}
                className="w-full border rounded p-1 text-xs h-20"
              >
                {yOptions.map((h) => (
                  <option key={h} value={h}>
                    {h}
                  </option>
                ))}
              </select>
            </div>
            {/* Экспорт */}
            <Button
              onClick={exportPNG}
              className="w-full text-xs flex justify-center items-center"
            >
              <Download size={14} className="mr-1 inline-block" /> PNG
            </Button>
            <Button
              onClick={exportCSV}
              className="w-full text-xs flex justify-center items-center"
            >
              <FileText size={14} className="mr-1 inline-block" /> CSV
            </Button>
          </CardContent>
        </Card>

        {/* График */}
        <Card className="flex-1 shadow rounded-lg">
          <CardHeader>
            <CardTitle className="text-sm font-medium">График</CardTitle>
          </CardHeader>
          <CardContent ref={chartRef} className="h-64 p-0">
            <ResponsiveContainer width="100%" height="100%">
              {chartType === "bar" && (
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey={xAxisKey} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Brush
                    dataKey={xAxisKey}
                    height={20}
                    stroke="var(--accent-color)"
                  />
                  {yAxisKeys.map((k, i) => (
                    <Bar key={k} dataKey={k} fill={COLORS[i % COLORS.length]} />
                  ))}
                </BarChart>
              )}
              {chartType === "area" && (
                <AreaChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey={xAxisKey} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Brush
                    dataKey={xAxisKey}
                    height={20}
                    stroke="var(--accent-color)"
                  />
                  {yAxisKeys.map((k, i) => (
                    <Area
                      key={k}
                      type="monotone"
                      dataKey={k}
                      stroke={COLORS[i % COLORS.length]}
                      fill={COLORS[i % COLORS.length]}
                    />
                  ))}
                </AreaChart>
              )}
              {chartType === "scatter" && (
                <ScatterChart data={chartData}>
                  <CartesianGrid />
                  <XAxis dataKey={xAxisKey} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Brush
                    dataKey={xAxisKey}
                    height={20}
                    stroke="var(--accent-color)"
                  />
                  {yAxisKeys.map((k, i) => (
                    <Scatter
                      key={k}
                      dataKey={k}
                      fill={COLORS[i % COLORS.length]}
                    />
                  ))}
                </ScatterChart>
              )}
              {chartType === "line" && (
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey={xAxisKey} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Brush
                    dataKey={xAxisKey}
                    height={20}
                    stroke="var(--accent-color)"
                  />
                  {yAxisKeys.map((k, i) => (
                    <Line
                      key={k}
                      type="monotone"
                      dataKey={k}
                      stroke={COLORS[i % COLORS.length]}
                      dot={false}
                    />
                  ))}
                </LineChart>
              )}
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Локальный лог (для отладки) */}
        <Card className="w-1/4 shadow rounded-lg">
          <CardHeader>
            <CardTitle className="text-sm font-medium">История</CardTitle>
          </CardHeader>
          <CardContent className="text-xs h-64 overflow-y-auto space-y-1">
            {!historyLog.length ? (
              <p className="text-gray-500">Нет действий</p>
            ) : (
              historyLog.map((r, i) => (
                <div key={i}>
                  <span className="text-gray-400">
                    [{r.time.toLocaleTimeString()}]
                  </span>{" "}
                  {r.action}
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      {/* Нижняя навигация */}
      <div className="flex justify-between mt-4">
        <Button variant="outline" onClick={() => navigate(-1)}>
          ← Артқа
        </Button>
        <Button onClick={() => navigate("/analytics/upload")}>
          <RefreshCw size={16} className="inline-block mr-1" /> Қайта жүктеу
        </Button>
      </div>
    </div>
  );
}
