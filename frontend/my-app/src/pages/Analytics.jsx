// src/pages/Analytics.jsx
import React, { useState, useRef, useEffect } from "react";
import Papa from "papaparse";
import * as XLSX from "xlsx";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf";
import workerUrl from "pdfjs-dist/build/pdf.worker.min.mjs?url";

import {
  Upload,
  Sun,
  Moon,
  ChartLine,
  ChartBar,
  ChartPie,
  Table as TableIcon,
} from "lucide-react";

import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";

// PDF.js воркер
pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl;

// Встроенный DataTable
function DataTable({ headers, data }) {
  return (
    <div className="overflow-x-auto rounded-lg shadow bg-white dark:bg-gray-800">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-700 sticky top-0 z-10">
          <tr>
            {headers.map((h, i) => (
              <th
                key={i}
                className="px-4 py-2 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase whitespace-nowrap"
                style={{ minWidth: 120 }}
                title={h}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-100 dark:divide-gray-700">
          {data.map((row, ri) => (
            <tr
              key={ri}
              className={
                ri % 2 === 0
                  ? "bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800"
                  : "hover:bg-gray-100 dark:hover:bg-gray-800"
              }
            >
              {row.map((cell, ci) => (
                <td
                  key={ci}
                  className="px-4 py-2 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200 truncate"
                  style={{ maxWidth: 120 }}
                  title={String(cell)}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const QUICKSTART = [
  { id: 1, title: "Линейный график", Icon: ChartLine },
  { id: 2, title: "Столбчатый график", Icon: ChartBar },
  { id: 3, title: "Круговая диаграмма", Icon: ChartPie },
  { id: 4, title: "Таблица данных", Icon: TableIcon },
];

export default function Analytics() {
  const [username] = useState("Айгүл");
  const [rawData, setRawData] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [chartType, setChartType] = useState("line");
  const fileInputRef = useRef(null);
  const [theme, setTheme] = useState("light");

  // Переключаем тему
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  // Обработчик загрузки файлов
  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const ext = file.name.split(".").pop().toLowerCase();

    try {
      if (ext === "csv") {
        Papa.parse(file, {
          header: false,
          skipEmptyLines: true,
          complete: ({ data }) => {
            setHeaders(data[0]);
            setRawData(data.slice(1));
          },
        });
      } else if (ext === "xlsx" || ext === "xls") {
        const reader = new FileReader();
        reader.onload = (ev) => {
          const arr = new Uint8Array(ev.target.result);
          const wb = XLSX.read(arr, { type: "array" });
          const ws = wb.Sheets[wb.SheetNames[0]];
          const rows = XLSX.utils.sheet_to_json(ws, { header: 1 });
          setHeaders(rows[0]);
          setRawData(rows.slice(1));
        };
        reader.readAsArrayBuffer(file);
      } else if (ext === "pdf") {
        const buffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;
        let lines = [];
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const txt = await page.getTextContent();
          const str = txt.items.map((it) => it.str).join(" ");
          lines.push(...str.split(/\r?\n/));
        }
        const parsed = lines
          .map((l) => l.trim())
          .filter(Boolean)
          .map((l) => l.split(/\s+/));
        if (parsed.length > 1) {
          setHeaders(parsed[0]);
          setRawData(parsed.slice(1));
        } else {
          alert("Не удалось извлечь таблицу из PDF.");
        }
      } else {
        alert("Только CSV, Excel или PDF.");
      }
    } catch (err) {
      console.error(err);
      alert("Ошибка при загрузке.");
    }
  };

  // Данные для графика
  const chartData = rawData.map((row) => ({
    [headers[0]]: row[0],
    [headers[1]]: parseFloat(row[1]) || 0,
  }));

  return (
    <div className="h-full flex flex-col">
      {/* Тумблер темы */}
      <div className="p-4 flex justify-end">
        <Button
          variant="ghost"
          onClick={() => setTheme((t) => (t === "light" ? "dark" : "light"))}
        >
          {theme === "light" ? <Moon /> : <Sun />}
        </Button>
      </div>

      {/* Основной скроллимый блок */}
      <div className="flex-1 overflow-y-auto">
        {/* Hero — залипает сверху */}
        <div className="sticky top-0 bg-gradient-to-r from-indigo-100 to-indigo-50 dark:from-gray-800 dark:to-gray-900 p-8 z-10">
          <Card className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-12">
            <h1 className="text-4xl font-bold mb-4">Сәлем, {username}!</h1>
            <p className="text-gray-700 dark:text-gray-300 mb-8">
              Аналитика бетіне қош келдіңіз. Деректер жүктеп, бастауға болады.
            </p>
            <Button
              size="lg"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2"
            >
              <Upload className="w-5 h-5" /> Деректерді жүктеу
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,.xlsx,.xls,.pdf"
              onChange={handleFileUpload}
              className="hidden"
            />
          </Card>
        </div>

        {/* Если данных ещё нет — Quickstart + «Как это работает» */}
        {rawData.length === 0 ? (
          <div className="px-8 pt-8 space-y-12">
            {/* Quickstart */}
            <section>
              <h2 className="text-2xl font-semibold mb-6">
                Бірден не істеуге болады
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {QUICKSTART.map(({ id, title, Icon }) => (
                  <Card
                    key={id}
                    className="flex items-center gap-4 p-6 bg-white dark:bg-gray-800 hover:shadow-xl cursor-pointer transition"
                  >
                    <Icon className="w-8 h-8 text-indigo-500" />
                    <span className="font-medium dark:text-gray-100">
                      {title}
                    </span>
                  </Card>
                ))}
              </div>
            </section>

            {/* Как это работает */}
            <section>
              <h2 className="text-2xl font-semibold mb-6">
                Қалай жұмыс істейді
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {[
                  {
                    step: 1,
                    text: "CSV, Excel немесе PDF жүктеңіз",
                    Icon: Upload,
                  },
                  { step: 2, text: "Есеп түрін таңдаңыз", Icon: ChartLine },
                  {
                    step: 3,
                    text: "Фильтрлер мен көрсеткіштерді баптаңыз",
                    Icon: ChartBar,
                  },
                  {
                    step: 4,
                    text: "Есепті экспорттаңыз",
                    Icon: TableIcon,
                  },
                ].map(({ step, text, Icon }) => (
                  <div
                    key={step}
                    className="flex flex-col items-center text-center"
                  >
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-indigo-500 text-white mb-3">
                      {step}
                    </div>
                    <Icon className="w-6 h-6 text-indigo-500 mb-2" />
                    <p className="dark:text-gray-300">{text}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        ) : (
          // === Есть данные ===
          <div className="px-8 pt-8 pb-16">
            <Tabs defaultValue="preview" className="mb-6">
              <TabsList>
                <TabsTrigger value="preview">Кесте</TabsTrigger>
                <TabsTrigger value="visualize">График</TabsTrigger>
              </TabsList>

              <TabsContent value="preview">
                <DataTable headers={headers} data={rawData} />
              </TabsContent>

              <TabsContent value="visualize">
                <ResponsiveContainer width="100%" height={300}>
                  {chartType === "line" && (
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey={headers[0]} />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey={headers[1]}
                        stroke="#4F46E5"
                      />
                    </LineChart>
                  )}
                  {chartType === "bar" && (
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey={headers[0]} />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey={headers[1]} fill="#4F46E5" />
                    </BarChart>
                  )}
                  {chartType === "pie" && (
                    <PieChart>
                      <Pie
                        data={chartData}
                        dataKey={headers[1]}
                        nameKey={headers[0]}
                        outerRadius={100}
                        fill="#4F46E5"
                        label
                      />
                      <Tooltip />
                    </PieChart>
                  )}
                </ResponsiveContainer>
                <div className="mt-4 w-48">
                  <Select defaultValue={chartType} onValueChange={setChartType}>
                    <SelectTrigger>
                      <SelectValue placeholder="График түрі" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="line">Линейный</SelectItem>
                      <SelectItem value="bar">Столбчатый</SelectItem>
                      <SelectItem value="pie">Круговой</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>
    </div>
  );
}
