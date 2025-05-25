// src/pages/History.jsx
import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../components/ui/dialog";
import { useHistoryLog } from "../contexts/HistoryContext";
import { useSettings } from "../contexts/SettingsContext";

// Типы событий для KPI
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
  const { events: records, deleteEvent, clearHistory } = useHistoryLog();
  const { settings } = useSettings();
  const { timeFormat, language } = settings;

  // Фильтры
  const [search, setSearch] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [typeFilter, setTypeFilter] = useState(
    EVENT_TYPES.reduce((acc, { key }) => ({ ...acc, [key]: true }), {})
  );

  // Состояния для модалок
  const [toDeleteId, setToDeleteId] = useState(null);
  const [clearAllOpen, setClearAllOpen] = useState(false);

  // Отфильтрованные записи
  const filtered = useMemo(() => {
    return records.filter((r) => {
      const datePart = (r.created_at || r.timestamp || "").slice(0, 10);
      if (dateFrom && datePart < dateFrom) return false;
      if (dateTo && datePart > dateTo) return false;
      if (!typeFilter[r.action]) return false;
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
    const cnt = EVENT_TYPES.reduce(
      (acc, { key }) => ({ ...acc, [key]: 0 }),
      {}
    );
    records.forEach((r) => {
      if (cnt[r.action] != null) cnt[r.action]++;
    });
    return cnt;
  }, [records]);

  // Форматировать время
  const formatTimestamp = (iso) => {
    if (!iso) return "—";
    const dt = new Date(iso);
    const opts = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: timeFormat === "12",
    };
    return new Intl.DateTimeFormat(language || "kk-KZ", opts).format(dt);
  };

  // Повторить операцию (пример)
  const rerun = (r) => {
    switch (r.action) {
      case "Upload CSV":
        navigate("/analytics/upload", { state: r.parameter });
        break;
      case "Filter CSV":
        navigate("/analytics/filter", { state: r.parameter });
        break;
      case "Export CSV":
        if (r.file_name) {
          const link = document.createElement("a");
          link.href = URL.createObjectURL(new Blob([], { type: "text/csv" }));
          link.download = r.file_name;
          link.click();
        }
        break;
      case "Export PNG":
        if (r.file_name) window.open(r.file_name, "_blank");
        break;
      default:
        break;
    }
  };

  // Экспорт истории в CSV
  const exportLogCSV = () => {
    if (!records.length) return;
    const header = [
      "Уақыты",
      "Пайдаланушы",
      "Роль",
      "Іс-әрекет",
      "Параметрлер",
      "Файл",
    ];
    const rows = records.map((r) => [
      r.created_at || r.timestamp || "",
      r.user_fullname,
      r.user_role || "",
      r.action,
      JSON.stringify(r.parameter),
      r.file_name || "",
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

  return (
    <div className="p-4 space-y-4 bg-gray-50 dark:bg-gray-900">
      {/* KPI-карточки */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {EVENT_TYPES.map(({ key, label, icon: Icon, color }) => (
          <Card key={key} className="shadow rounded-lg overflow-hidden">
            <CardHeader className="bg-white dark:bg-gray-800">
              <CardTitle className="flex items-center text-sm text-gray-700 dark:text-gray-200">
                <Icon className={`${color} w-5 h-5`} />
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
          <CardTitle className="text-gray-800 dark:text-gray-200">
            Сүзгілер
          </CardTitle>
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
              className="border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
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
              className="border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
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
              className="border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
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

      {/* Таблица */}
      <div className="overflow-auto max-h-[55vh] bg-white dark:bg-gray-800 shadow rounded-lg">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100 dark:bg-gray-700">
            <tr>
              {[
                "Күн/Уақыт",
                "Пайдаланушы",
                "Роль",
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
            {filtered.length === 0 && (
              <tr>
                <td
                  colSpan={7}
                  className="p-4 text-center text-gray-500 dark:text-gray-300"
                >
                  Лог табылмады
                </td>
              </tr>
            )}
            {filtered.map((r) => (
              <tr
                key={r.id}
                className="odd:bg-white even:bg-gray-50 dark:odd:bg-gray-800 dark:even:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600"
              >
                <td className="px-3 py-2">
                  {formatTimestamp(r.created_at || r.timestamp)}
                </td>
                <td className="px-3 py-2">{r.user_fullname}</td>
                <td className="px-3 py-2">{r.user_role || "—"}</td>
                <td className="px-3 py-2">
                  {EVENT_TYPES.find((e) => e.key === r.action)?.label ||
                    r.action}
                </td>
                <td className="px-3 py-2 dark:text-gray-200">
                  <pre className="text-xs whitespace-pre-wrap break-words">
                    {JSON.stringify(r.parameter, null, 2)}
                  </pre>
                </td>
                <td className="px-3 py-2">{r.file_name || "—"}</td>
                <td className="px-3 py-2 flex gap-2">
                  <button
                    onClick={() => rerun(r)}
                    className="p-1 hover:text-blue-600"
                  >
                    <ArrowRightCircle size={18} />
                  </button>
                  <button
                    onClick={() => setToDeleteId(r.id)}
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

      {/* Действия */}
      <div className="flex justify-between items-center mt-4">
        <Button
          onClick={() => setClearAllOpen(true)}
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

      {/* Диалог удаления одной записи */}
      <Dialog
        open={toDeleteId !== null}
        onOpenChange={(open) => !open && setToDeleteId(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Жоюды растайсыз ба?</DialogTitle>
            <DialogDescription>
              Сіз бұл жазбаны шынымен жойғыңыз келе ме?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setToDeleteId(null)}>
              Жоқ
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                deleteEvent(toDeleteId);
                setToDeleteId(null);
              }}
            >
              Иә
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Диалог очистки всех записей */}
      <Dialog open={clearAllOpen} onOpenChange={setClearAllOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Барлық жазбаларды жойғызыз ба?</DialogTitle>
            <DialogDescription>Бұл әрекет қайтымсыз.</DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setClearAllOpen(false)}>
              Жоқ
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                clearHistory();
                setClearAllOpen(false);
              }}
            >
              Иә
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
