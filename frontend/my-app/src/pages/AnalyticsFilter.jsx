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

  // Если нет данных — редирект обратно
  useEffect(() => {
    if (!headers.length || !data.length) {
      navigate("/analytics/upload", { replace: true });
    }
  }, [headers, data, navigate]);

  // Состояния фильтра
  const [globalSearch, setGlobalSearch] = useState("");
  const [selectedEquip, setSelectedEquip] = useState([]);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [colIndex, setColIndex] = useState(0);
  const [operator, setOperator] = useState("contains");
  const [filterValue, setFilterValue] = useState("");
  const [visibleCols, setVisibleCols] = useState(headers.map(() => true));
  const [sortCol, setSortCol] = useState(null);
  const [sortAsc, setSortAsc] = useState(true);

  // Fullscreen API
  const tableContainerRef = useRef(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      tableContainerRef.current?.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  useEffect(() => {
    const onFsChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onFsChange);
    return () => document.removeEventListener("fullscreenchange", onFsChange);
  }, []);

  // Фильтрация и сортировка
  const filtered = useMemo(() => {
    let rows = data.filter((row) => {
      if (globalSearch) {
        const hay = row.join(" ").toLowerCase();
        if (!hay.includes(globalSearch.toLowerCase())) return false;
      }
      const eqIdx = headers.indexOf("Жабдық");
      if (eqIdx >= 0 && selectedEquip.length) {
        if (!selectedEquip.includes(row[eqIdx])) return false;
      }
      const dateIdx = headers.indexOf("Күні");
      if (dateIdx >= 0) {
        if (fromDate && row[dateIdx] < fromDate) return false;
        if (toDate && row[dateIdx] > toDate) return false;
      }
      if (filterValue) {
        const cell = String(row[colIndex]).toLowerCase();
        const fv = filterValue.toLowerCase();
        if (operator === "contains" && !cell.includes(fv)) return false;
        if (operator === "equals" && cell !== fv) return false;
        if (operator === "gt" && Number(cell) <= Number(filterValue))
          return false;
        if (operator === "lt" && Number(cell) >= Number(filterValue))
          return false;
      }
      return true;
    });

    if (sortCol !== null) {
      rows.sort((a, b) => {
        const v1 = a[sortCol],
          v2 = b[sortCol];
        if (v1 === v2) return 0;
        const cmp = v1 > v2 ? 1 : -1;
        return sortAsc ? cmp : -cmp;
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

  // CSV-экспорт
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
      params: {
        dateFrom: fromDate,
        dateTo: toDate,
        cols: activeHeaders,
      },
      file: filename,
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-4 space-y-6">
      {/* Шаги */}
      <div className="flex items-center space-x-2">
        <div className="flex items-center space-x-1">
          <span className="w-6 h-6 flex items-center justify-center rounded-full bg-indigo-600 text-white">
            1
          </span>
          <span className="text-gray-600">Жүктеу</span>
        </div>
        <div className="flex-1 h-px bg-gray-300" />
        <div className="flex items-center space-x-1">
          <span className="w-6 h-6 flex items-center justify-center rounded-full bg-indigo-600 text-white">
            2
          </span>
          <span className="text-indigo-600 font-semibold">Сүзу</span>
        </div>
        <div className="flex-1 h-px bg-gray-300" />
        <div className="flex items-center space-x-1">
          <span className="w-6 h-6 flex items-center justify-center rounded-full bg-gray-300 text-gray-700">
            3
          </span>
          <span className="text-gray-600">Визуалдау</span>
        </div>
      </div>

      {/* Панель фильтра */}
      <Card>
        <CardHeader>
          <CardTitle>
            <Filter size={20} className="text-indigo-600" />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Поиск, оборудование, даты */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block mb-1 text-sm">Іздеу</label>
              <Input
                value={globalSearch}
                onChange={(e) => setGlobalSearch(e.target.value)}
                placeholder="Жалпы іздеу..."
              />
            </div>
            <div>
              <label className="block mb-1 text-sm">Жабдық</label>
              <select
                multiple
                value={selectedEquip}
                onChange={(e) =>
                  setSelectedEquip(
                    Array.from(e.target.selectedOptions, (o) => o.value)
                  )
                }
                className="w-full h-20 border rounded"
              >
                {Array.from(
                  new Set(data.map((r) => r[headers.indexOf("Жабдық")]))
                ).map((eq) => (
                  <option key={eq} value={eq}>
                    {eq}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block mb-1 text-sm">Күннен</label>
              <Input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
              />
            </div>
            <div>
              <label className="block mb-1 text-sm">Күнге дейін</label>
              <Input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
              />
            </div>
          </div>

          {/* Фильтр по колонке */}
          <div className="flex flex-wrap items-end gap-4">
            <div className="flex-1 min-w-[150px]">
              <label className="block mb-1 text-sm">Баған</label>
              <select
                value={colIndex}
                onChange={(e) => setColIndex(+e.target.value)}
                className="w-full border rounded"
              >
                {headers.map((h, i) => (
                  <option key={i} value={i}>
                    {h}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex-1 min-w-[150px]">
              <label className="block mb-1 text-sm">Оператор</label>
              <select
                value={operator}
                onChange={(e) => setOperator(e.target.value)}
                className="w-full border rounded"
              >
                <option value="contains">содержит</option>
                <option value="equals">=</option>
                <option value="gt">&gt;</option>
                <option value="lt">&lt;</option>
              </select>
            </div>
            <div className="flex-1 min-w-[150px]">
              <label className="block mb-1 text-sm">Мән</label>
              <Input
                value={filterValue}
                onChange={(e) => setFilterValue(e.target.value)}
                placeholder="Мән..."
              />
            </div>
            <div className="flex space-x-2 pb-1">
              <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
                Қолдану
              </Button>
              <Button
                variant="outline"
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

      {/* Результаты + Fullscreen */}
      <div className="relative">
        <button
          onClick={toggleFullscreen}
          className="absolute top-2 right-2 z-10 p-1 bg-white rounded shadow hover:bg-gray-100"
          title={
            isFullscreen ? "Выйти из полноэкранного" : "Полноэкранный режим"
          }
        >
          {isFullscreen ? "✕" : "⛶"}
        </button>
        <div
          ref={tableContainerRef}
          className="border rounded overflow-auto max-h-[50vh] transition-all duration-300"
          style={isFullscreen ? { height: "100vh", maxHeight: "100vh" } : {}}
        >
          <table className="min-w-full text-sm">
            <thead className="sticky top-0 bg-gray-100">
              <tr>
                {headers.map(
                  (h, i) =>
                    visibleCols[i] && (
                      <th
                        key={i}
                        className="px-2 py-1 text-left cursor-pointer"
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
                    )
                )}
              </tr>
            </thead>
            <tbody>
              {filtered.length ? (
                filtered.map((row, ri) => (
                  <tr
                    key={ri}
                    className="odd:bg-white even:bg-gray-50 hover:bg-gray-100"
                  >
                    {row.map(
                      (cell, ci) =>
                        visibleCols[ci] && (
                          <td key={ci} className="px-2 py-1 whitespace-nowrap">
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
                    className="p-4 text-center text-gray-500"
                  >
                    Жазбалар табылмады
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Нижняя панель с кнопками */}
      <div className="flex justify-between items-center">
        <Button
          variant="ghost"
          onClick={() => navigate("/analytics/upload")}
          className="text-indigo-600 hover:text-indigo-800"
        >
          ← Жүктеу
        </Button>
        <div className="space-x-2">
          <Button variant="outline" onClick={exportCSV}>
            CSV экспорт
          </Button>
          <Button
            onClick={() =>
              navigate("/analytics/visualize", {
                state: {
                  headers,
                  data: filtered,
                  metrics: headers.filter((_, i) => visibleCols[i]),
                },
              })
            }
            className="bg-indigo-600 hover:bg-indigo-700 text-white"
          >
            Визуалдау →
          </Button>
        </div>
      </div>
    </div>
  );
}
