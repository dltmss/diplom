// src/pages/AnalyticsFilter.jsx
import React, { useState, useEffect, useMemo, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Filter } from "lucide-react";
import { useHistoryLog } from "../contexts/HistoryContext";

export default function AnalyticsFilter() {
  const navigate = useNavigate();
  const { addEvent } = useHistoryLog();
  const { state } = useLocation();
  const { headers = [], data = [] } = state || {};

  // Если нет входных данных — сразу возвращаемся на загрузку
  useEffect(() => {
    if (!headers.length || !data.length) {
      navigate("/analytics/upload", { replace: true });
    }
  }, [headers, data, navigate]);

  // 1) Общие фильтры
  const [globalSearch, setGlobalSearch] = useState("");
  const [selectedEquip, setSelectedEquip] = useState([]);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  // 2) Фильтр по одной колонке
  const [colIndex, setColIndex] = useState(0);
  const [operator, setOperator] = useState("contains");
  const [filterValue, setFilterValue] = useState("");

  // 3) Какие колонки показывать
  const [visibleCols, setVisibleCols] = useState(headers.map(() => true));
  useEffect(() => {
    setVisibleCols(headers.map(() => true));
  }, [headers]);

  // 4) Сортировка
  const [sortCol, setSortCol] = useState(null);
  const [sortAsc, setSortAsc] = useState(true);

  // 5) Fullscreen таблицы
  const tableRef = useRef(null);
  const [isFs, setIsFs] = useState(false);
  useEffect(() => {
    const onFs = () => setIsFs(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", onFs);
    return () => document.removeEventListener("fullscreenchange", onFs);
  }, []);
  const toggleFs = () => {
    if (!document.fullscreenElement) tableRef.current?.requestFullscreen();
    else document.exitFullscreen();
  };

  // Вычисляем отфильтрованный + отсортированный массив
  const filtered = useMemo(() => {
    let rows = data.filter((row) => {
      // глобальный поиск
      if (globalSearch) {
        const hay = row.join(" ").toLowerCase();
        if (!hay.includes(globalSearch.toLowerCase())) return false;
      }
      // выбор оборудования
      const eqIdx = headers.indexOf("Жабдық");
      if (eqIdx >= 0 && selectedEquip.length > 0) {
        if (!selectedEquip.includes(row[eqIdx])) return false;
      }
      // по датам
      const dateIdx = headers.indexOf("Күні");
      if (dateIdx >= 0) {
        if (fromDate && row[dateIdx] < fromDate) return false;
        if (toDate && row[dateIdx] > toDate) return false;
      }
      // по одной колонке
      if (filterValue) {
        const cell = String(row[colIndex]).toLowerCase();
        const fv = filterValue.toLowerCase();
        if (operator === "contains" && !cell.includes(fv)) return false;
        if (operator === "equals" && cell !== fv) return false;
        if (operator === "gt" && +cell <= +filterValue) return false;
        if (operator === "lt" && +cell >= +filterValue) return false;
      }
      return true;
    });

    if (sortCol !== null) {
      rows.sort((a, b) => {
        const v1 = a[sortCol],
          v2 = b[sortCol];
        if (v1 === v2) return 0;
        const c = v1 > v2 ? 1 : -1;
        return sortAsc ? c : -c;
      });
    }
    return rows;
  }, [
    data,
    headers,
    globalSearch,
    selectedEquip,
    fromDate,
    toDate,
    colIndex,
    operator,
    filterValue,
    sortCol,
    sortAsc,
  ]);

  // Экспорт видимых колонок в CSV
  const exportCSV = () => {
    if (!filtered.length) return;
    const activeHeaders = headers.filter((_, i) => visibleCols[i]);
    const rows = [
      activeHeaders.join(","),
      ...filtered.map((r) => r.filter((_, i) => visibleCols[i]).join(",")),
    ];
    const csv = rows.join("\n");
    const filename = `filtered_${Date.now()}.csv`;
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);

    addEvent({
      type: "Filter CSV",
      params: { dateFrom: fromDate, dateTo, cols: activeHeaders },
      file: filename,
    });
  };

  // Переход на страницу визуализации
  const goVisualize = () => {
    const outHeaders = headers.filter((_, i) => visibleCols[i]);
    navigate("/analytics/visualize", {
      state: {
        headers: outHeaders,
        data: filtered,
        metrics: outHeaders,
      },
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-4 space-y-6 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Шаги */}
      <div className="flex items-center space-x-2">
        <div className="flex items-center space-x-1">
          <span className="w-6 h-6 flex items-center justify-center rounded-full bg-indigo-600 text-white">
            1
          </span>
          <span className="text-gray-600 dark:text-gray-400">Жүктеу</span>
        </div>
        <div className="flex-1 h-px bg-gray-300 dark:bg-gray-700" />
        <div className="flex items-center space-x-1">
          <span className="w-6 h-6 flex items-center justify-center rounded-full bg-indigo-600 text-white">
            2
          </span>
          <span className="text-indigo-600 font-semibold">Сүзу</span>
        </div>
        <div className="flex-1 h-px bg-gray-300 dark:bg-gray-700" />
        <div className="flex items-center space-x-1">
          <span className="w-6 h-6 flex items-center justify-center rounded-full bg-gray-300 text-gray-700 dark:bg-gray-700 dark:text-gray-400">
            3
          </span>
          <span className="text-gray-600 dark:text-gray-400">Визуалдау</span>
        </div>
      </div>

      {/* Панель фильтров */}
      <Card className="bg-gray-100 dark:bg-gray-800 border dark:border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center text-gray-900 dark:text-gray-100">
            <Filter size={20} className="text-indigo-600 mr-2" /> Сүзу
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Общие фильтры */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block mb-1 text-sm dark:text-gray-300">
                Іздеу
              </label>
              <Input
                value={globalSearch}
                onChange={(e) => setGlobalSearch(e.target.value)}
                placeholder="Жалпы іздеу..."
                className="bg-white dark:bg-gray-700 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
              />
            </div>
            <div>
              <label className="block mb-1 text-sm dark:text-gray-300">
                Жабдық
              </label>
              <select
                multiple
                value={selectedEquip}
                onChange={(e) =>
                  setSelectedEquip(
                    Array.from(e.target.selectedOptions, (o) => o.value)
                  )
                }
                className="w-full h-20 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded"
              >
                {Array.from(
                  new Set(data.map((r) => r[headers.indexOf("Жабдық")]))
                ).map((eq) => (
                  <option
                    key={eq}
                    value={eq}
                    className="bg-white dark:bg-gray-700"
                  >
                    {eq}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block mb-1 text-sm dark:text-gray-300">
                Күннен
              </label>
              <Input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="bg-white dark:bg-gray-700 dark:text-gray-100"
              />
            </div>
            <div>
              <label className="block mb-1 text-sm dark:text-gray-300">
                Күнге дейін
              </label>
              <Input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="bg-white dark:bg-gray-700 dark:text-gray-100"
              />
            </div>
          </div>

          {/* Видимые колонки */}
          <div>
            <p className="mb-1 text-sm font-medium dark:text-gray-300">
              Көрсету бағандары
            </p>
            <div className="flex flex-wrap gap-3">
              {headers.map((h, i) => (
                <label key={i} className="inline-flex items-center space-x-1">
                  <input
                    type="checkbox"
                    checked={visibleCols[i]}
                    onChange={() => {
                      const c = [...visibleCols];
                      c[i] = !c[i];
                      setVisibleCols(c);
                    }}
                    className="accent-indigo-600"
                  />
                  <span className="text-sm dark:text-gray-200">{h}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Фильтр по колонке */}
          <div className="flex flex-wrap items-end gap-4">
            <div className="flex-1 min-w-[150px]">
              <label className="block mb-1 text-sm dark:text-gray-300">
                Баған
              </label>
              <select
                value={colIndex}
                onChange={(e) => setColIndex(+e.target.value)}
                className="w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded px-2 py-1"
              >
                {headers.map((h, i) => (
                  <option key={i} value={i}>
                    {h}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex-1 min-w-[150px]">
              <label className="block mb-1 text-sm dark:text-gray-300">
                Оператор
              </label>
              <select
                value={operator}
                onChange={(e) => setOperator(e.target.value)}
                className="w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded px-2 py-1"
              >
                <option value="contains">содержит</option>
                <option value="equals">=</option>
                <option value="gt">&gt;</option>
                <option value="lt">&lt;</option>
              </select>
            </div>
            <div className="flex-1 min-w-[150px]">
              <label className="block mb-1 text-sm dark:text-gray-300">
                Мән
              </label>
              <Input
                value={filterValue}
                onChange={(e) => setFilterValue(e.target.value)}
                placeholder="Мән..."
                className="bg-white dark:bg-gray-700 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
              />
            </div>
            <div className="flex space-x-2 pb-1">
              <Button
                className="bg-indigo-600 hover:bg-indigo-700 text-white"
                onClick={exportCSV}
              >
                Қолдану
              </Button>
              <Button
                variant="outline"
                className="border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                onClick={() => {
                  setGlobalSearch("");
                  setSelectedEquip([]);
                  setFromDate("");
                  setToDate("");
                  setFilterValue("");
                }}
              >
                Болдырмау
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Таблица с fullscreen */}
      <div className="relative">
        <button
          onClick={toggleFs}
          className="absolute top-2 right-2 z-10 p-1 bg-white dark:bg-gray-800 rounded shadow hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100"
          title={isFs ? "Шығу" : "Толық экран"}
        >
          {isFs ? "✕" : "⛶"}
        </button>
        <div
          ref={tableRef}
          className="border rounded overflow-auto"
          style={
            isFs
              ? { height: "100vh", maxHeight: "100vh" }
              : { maxHeight: "50vh" }
          }
        >
          <table className="min-w-full text-sm">
            <thead className="sticky top-0 bg-gray-200 dark:bg-gray-800">
              <tr>
                {headers.map((h, i) =>
                  visibleCols[i] ? (
                    <th
                      key={i}
                      className="px-2 py-1 text-left cursor-pointer select-none text-gray-900 dark:text-gray-100"
                      onClick={() => {
                        if (sortCol === i) setSortAsc(!sortAsc);
                        else {
                          setSortCol(i);
                          setSortAsc(true);
                        }
                      }}
                    >
                      {h} {sortCol === i ? (sortAsc ? "↑" : "↓") : ""}
                    </th>
                  ) : null
                )}
              </tr>
            </thead>
            <tbody>
              {filtered.length > 0 ? (
                filtered.map((row, ri) => (
                  <tr
                    key={ri}
                    className={`odd:bg-white even:bg-gray-50 dark:odd:bg-gray-900 dark:even:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700`}
                  >
                    {row.map(
                      (cell, ci) =>
                        visibleCols[ci] && (
                          <td
                            key={ci}
                            className="px-2 py-1 whitespace-nowrap text-gray-900 dark:text-gray-100"
                          >
                            {cell}
                          </td>
                        )
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={visibleCols.filter(Boolean).length}
                    className="p-4 text-center text-gray-500 dark:text-gray-400"
                  >
                    Жазбалар табылмады
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Нижняя навигация */}
      <div className="flex justify-between items-center">
        <Button
          variant="ghost"
          className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800"
          onClick={() => navigate("/analytics/upload")}
        >
          ← Жүктеу
        </Button>
        <div className="space-x-2">
          <Button
            variant="outline"
            className="border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
            onClick={exportCSV}
          >
            CSV экспорт
          </Button>
          <Button
            className="bg-indigo-600 hover:bg-indigo-700 text-white"
            onClick={goVisualize}
          >
            Визуалдау →
          </Button>
        </div>
      </div>
    </div>
  );
}
