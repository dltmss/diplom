// src/pages/History.jsx
import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  ArrowUp,
  FileText,
  Download as DownloadIcon,
  ArrowRightCircle,
  Trash2,
} from "lucide-react";
import { useHistoryLog } from "../contexts/HistoryContext";

// Англ. ключи для логики + метки и иконки — на казахском
const EVENT_TYPES = [
  {
    key: "Upload CSV",
    label: "CSV жүктеу",
    icon: ArrowUp,
    color: "text-blue-500",
  },
  {
    key: "Filter CSV",
    label: "CSV сүзгілеу",
    icon: FileText,
    color: "text-green-500",
  },
  {
    key: "Export CSV",
    label: "CSV экспорттау",
    icon: FileText,
    color: "text-yellow-500",
  },
  {
    key: "Export PNG",
    label: "PNG экспорттау",
    icon: DownloadIcon,
    color: "text-red-500",
  },
];

export default function History() {
  const navigate = useNavigate();
  const { events: records, clearHistory, deleteEvent } = useHistoryLog();

  // фильтры
  const [search, setSearch] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [typeFilter, setTypeFilter] = useState(
    EVENT_TYPES.reduce((acc, { key }) => {
      acc[key] = true;
      return acc;
    }, {})
  );

  // отфильтрованные записи
  const filtered = useMemo(() => {
    return (records || []).filter((r) => {
      const d = r.timestamp.slice(0, 10);
      if (dateFrom && d < dateFrom) return false;
      if (dateTo && d > dateTo) return false;
      if (!typeFilter[r.type]) return false;
      if (
        search &&
        !JSON.stringify(r).toLowerCase().includes(search.toLowerCase())
      )
        return false;
      return true;
    });
  }, [records, search, dateFrom, dateTo, typeFilter]);

  // KPI-счётчики
  const stats = useMemo(() => {
    const cnt = {};
    EVENT_TYPES.forEach(({ key }) => (cnt[key] = 0));
    (records || []).forEach((r) => {
      if (cnt[r.type] != null) cnt[r.type]++;
    });
    return cnt;
  }, [records]);

  // экспорт всего лога в CSV
  const exportLogCSV = () => {
    if (!records?.length) return;
    const header = [
      "Уақыты",
      "Пайдаланушы",
      "Іс-әрекет",
      "Параметрлер",
      "Файл",
    ];
    const rows = records.map((r) => [
      r.timestamp,
      r.user,
      r.type,
      JSON.stringify(r.params),
      r.file || "",
    ]);
    const csv = [header.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `history_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // повторить действие
  const rerun = (rec) => {
    switch (rec.type) {
      case "Upload CSV":
        navigate("/analytics/upload", { state: rec.params });
        break;
      case "Filter CSV":
        navigate("/analytics/filter", { state: rec.params });
        break;
      case "Export CSV":
        if (rec.file) {
          const a = document.createElement("a");
          a.href = URL.createObjectURL(new Blob([], { type: "text/csv" }));
          a.download = rec.file;
          a.click();
        }
        break;
      case "Export PNG":
        if (rec.file) window.open(rec.file, "_blank");
        break;
      default:
        break;
    }
  };

  return (
    <AnimatePresence exitBeforeEnter>
      <motion.div
        key="history"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className="p-4 space-y-4 bg-gray-50 dark:bg-gray-900"
      >
        {/* KPI-карточки */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {EVENT_TYPES.map(({ key, label, icon: Icon, color }) => (
            <Card key={key} className="shadow rounded-lg overflow-hidden">
              <CardHeader className="bg-white dark:bg-gray-800">
                <CardTitle className="flex items-center text-sm text-gray-700 dark:text-gray-200">
                  <Icon className={`w-5 h-5 ${color}`} />
                  <span className="ml-2">{label}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="bg-white dark:bg-gray-800 p-3">
                <div className="text-2xl font-extrabold text-gray-900 dark:text-gray-100">
                  {stats[key]}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Фильтры */}
        <Card className="shadow rounded-lg bg-white dark:bg-gray-800">
          <CardHeader>
            <CardTitle>Фильтрлер</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block mb-1 text-sm text-gray-700 dark:text-gray-300">
                Іздеу
              </label>
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Мысалы: admin"
                className="border-gray-300 dark:border-gray-600"
              />
            </div>
            <div>
              <label className="block mb-1 text-sm text-gray-700 dark:text-gray-300">
                Басталатын күн
              </label>
              <Input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="border-gray-300 dark:border-gray-600"
              />
            </div>
            <div>
              <label className="block mb-1 text-sm text-gray-700 dark:text-gray-300">
                Аяқталатын күн
              </label>
              <Input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="border-gray-300 dark:border-gray-600"
              />
            </div>
            <div>
              <p className="mb-1 text-sm text-gray-700 dark:text-gray-300">
                Іс-әрекет түрі
              </p>
              <div className="flex flex-wrap gap-2">
                {EVENT_TYPES.map(({ key, label }) => (
                  <label
                    key={key}
                    className="inline-flex items-center space-x-1 text-sm text-gray-800 dark:text-gray-200"
                  >
                    <input
                      type="checkbox"
                      checked={typeFilter[key]}
                      onChange={() =>
                        setTypeFilter((f) => ({ ...f, [key]: !f[key] }))
                      }
                      className="accent-blue-600"
                    />
                    <span>{label}</span>
                  </label>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* история или пусто */}
        {!records?.length ? (
          <Card className="text-center p-6 bg-white dark:bg-gray-800 shadow rounded-lg">
            <p className="text-gray-500 dark:text-gray-400">
              Тарих әлі бос. Мұнда әрекеттеріңіз көрсетіледі.
            </p>
            <Button
              onClick={() => navigate("/analytics/upload")}
              className="mt-4 bg-blue-600 hover:bg-blue-700 text-white"
            >
              CSV жүктеуге өту
            </Button>
          </Card>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            <div className="overflow-auto max-h-[55vh] bg-white dark:bg-gray-800 shadow rounded-lg">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-100 dark:bg-gray-700">
                  <tr>
                    {[
                      "Күн/Уақыт",
                      "Пайдаланушы",
                      "Іс-әрекет",
                      "Параметрлер",
                      "Файл",
                      "Әрекет",
                    ].map((h) => (
                      <th
                        key={h}
                        className="px-3 py-2 text-left text-gray-600 dark:text-gray-300"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((r) => (
                    <tr
                      key={r.id}
                      className="odd:bg-white even:bg-gray-50 dark:even:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600"
                    >
                      <td className="px-3 py-2 whitespace-nowrap text-gray-800 dark:text-gray-200">
                        {new Date(r.timestamp).toLocaleString("kk-KZ")}
                      </td>
                      <td className="px-3 py-2">{r.user}</td>
                      <td className="px-3 py-2">
                        {EVENT_TYPES.find((e) => e.key === r.type)?.label ||
                          r.type}
                      </td>
                      <td className="px-3 py-2 text-gray-700 dark:text-gray-300">
                        <pre className="text-xs">
                          {JSON.stringify(r.params, null, 2)}
                        </pre>
                      </td>
                      <td className="px-3 py-2">{r.file || "—"}</td>
                      <td className="px-3 py-2 flex gap-2">
                        <button
                          onClick={() => rerun(r)}
                          title="Қайта орындау"
                          className="p-1 hover:text-blue-600"
                        >
                          <ArrowRightCircle size={18} />
                        </button>
                        <button
                          onClick={() => deleteEvent(r.id)}
                          title="Жою"
                          className="p-1 hover:text-red-600"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Очистить всё и экспорт лога */}
            <div className="flex justify-between items-center">
              <Button
                onClick={clearHistory}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Барлығын тазалау
              </Button>
              <Button
                onClick={exportLogCSV}
                className="flex items-center bg-blue-600 hover:bg-blue-700 text-white"
              >
                <DownloadIcon size={16} className="mr-1" />
                Логты CSV-ке экспорттау
              </Button>
            </div>
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
