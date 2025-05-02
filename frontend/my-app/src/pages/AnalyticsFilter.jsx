// src/pages/AnalyticsFilter.jsx
import React, { useState, useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";

export default function AnalyticsFilter() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { headers = [], data = [] } = state || {};

  // Если нет данных — возвращаемся на загрузку
  useEffect(() => {
    if (!headers.length || !data.length) {
      navigate("/analytics/upload", { replace: true });
    }
  }, [headers, data, navigate]);

  // Фильтры
  const [globalQuery, setGlobalQuery] = useState("");
  const [equipmentFilter, setEquipmentFilter] = useState([]);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [colIndex, setColIndex] = useState(0);
  const [operator, setOperator] = useState("contains");
  const [filterValue, setFilterValue] = useState("");

  // Видимость колонок
  const [visibleCols, setVisibleCols] = useState(headers.map(() => true));

  // Сортировка
  const [sortCol, setSortCol] = useState(null);
  const [sortAsc, setSortAsc] = useState(true);

  // Отфильтрованные и отсортированные данные
  const filtered = useMemo(() => {
    return data
      .filter((row) => {
        // 1) Глобальный поиск
        if (globalQuery) {
          const hay = row.join(" ").toLowerCase();
          if (!hay.includes(globalQuery.toLowerCase())) return false;
        }
        // 2) Multi-select оборудования (колонка "Жабдық")
        const eqIdx = headers.indexOf("Жабдық");
        if (equipmentFilter.length && eqIdx >= 0) {
          if (!equipmentFilter.includes(row[eqIdx])) return false;
        }
        // 3) Диапазон дат (колонка "Күні")
        const dateIdx = headers.indexOf("Күні");
        if (dateIdx >= 0) {
          const d = row[dateIdx];
          if (fromDate && d < fromDate) return false;
          if (toDate && d > toDate) return false;
        }
        // 4) Фильтр по выбранной колонке + оператор
        if (filterValue) {
          const cell = row[colIndex];
          const val = String(cell).toLowerCase();
          const fv = filterValue.toLowerCase();
          if (operator === "contains" && !val.includes(fv)) return false;
          if (operator === "equals" && val !== fv) return false;
          if (operator === "gt" && Number(cell) <= Number(filterValue))
            return false;
          if (operator === "lt" && Number(cell) >= Number(filterValue))
            return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortCol === null) return 0;
        const aa = a[sortCol];
        const bb = b[sortCol];
        if (aa === bb) return 0;
        const cmp = aa > bb ? 1 : -1;
        return sortAsc ? cmp : -cmp;
      });
  }, [
    data,
    headers,
    globalQuery,
    equipmentFilter,
    fromDate,
    toDate,
    colIndex,
    operator,
    filterValue,
    sortCol,
    sortAsc,
  ]);

  // Экспорт в CSV
  const exportCSV = () => {
    if (!filtered.length) return;
    const activeH = headers.filter((_, i) => visibleCols[i]);
    const rows = [
      activeH.join(","),
      ...filtered.map((r) => r.filter((_, i) => visibleCols[i]).join(",")),
    ];
    const blob = new Blob([rows.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `filtered_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Фирменный цвет
  const ACCENT = "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 text-white";

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Сте́ппер */}
      <div className="flex items-center justify-center space-x-4">
        {["Жүктеу", "Сүзу", "Визуализация"].map((lab, i) => (
          <React.Fragment key={i}>
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                i === 1 ? "bg-blue-600 text-white" : "bg-gray-300 text-gray-700"
              }`}
            >
              {i + 1}
            </div>
            <span
              className={`text-sm ${
                i === 1 ? "font-semibold text-blue-600" : "text-gray-600"
              }`}
            >
              {lab}
            </span>
            {i < 2 && <div className="flex-1 h-px bg-gray-300" />}
          </React.Fragment>
        ))}
      </div>

      {/* Панель фильтров */}
      <Card className="bg-white shadow dark:bg-gray-800">
        <CardHeader>
          <CardTitle>Аналитика сүзгісі</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            {/* Глобальный поиск */}
            <div>
              <label className="block mb-1">Іздеу</label>
              <Input
                value={globalQuery}
                onChange={(e) => setGlobalQuery(e.target.value)}
                placeholder="Жалпы іздеу..."
                className="w-full"
              />
            </div>
            {/* Мультивыбор оборудования */}
            <div>
              <label className="block mb-1">Жабдық</label>
              <select
                multiple
                value={equipmentFilter}
                onChange={(e) =>
                  setEquipmentFilter(
                    Array.from(e.target.selectedOptions, (o) => o.value)
                  )
                }
                className="w-full h-24 border rounded px-2 py-1 bg-white dark:bg-gray-700 dark:text-white"
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
            {/* Даты */}
            <div>
              <label className="block mb-1">Күннен</label>
              <Input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="w-full"
              />
            </div>
            <div>
              <label className="block mb-1">Күнге дейін</label>
              <Input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="w-full"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-end">
            {/* Фильтр по колонке */}
            <div>
              <label className="block mb-1">Баган</label>
              <select
                value={colIndex}
                onChange={(e) => setColIndex(Number(e.target.value))}
                className="w-full border rounded px-2 py-1 bg-white dark:bg-gray-700 dark:text-white"
              >
                {headers.map((h, i) => (
                  <option key={i} value={i}>
                    {h}
                  </option>
                ))}
              </select>
            </div>
            {/* Оператор */}
            <div>
              <label className="block mb-1">Оператор</label>
              <select
                value={operator}
                onChange={(e) => setOperator(e.target.value)}
                className="w-full border rounded px-2 py-1 bg-white dark:bg-gray-700 dark:text-white"
              >
                <option value="contains">содержит</option>
                <option value="equals">=</option>
                <option value="gt">&gt;</option>
                <option value="lt">&lt;</option>
              </select>
            </div>
            {/* Значение */}
            <div className="md:col-span-2">
              <label className="block mb-1">Мән</label>
              <Input
                value={filterValue}
                onChange={(e) => setFilterValue(e.target.value)}
                placeholder="Фильтр мәні"
                className="w-full"
              />
            </div>
            {/* Кнопки */}
            <div className="flex space-x-2">
              <Button className={ACCENT} onClick={() => {}}>
                Қолдану
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setGlobalQuery("");
                  setEquipmentFilter([]);
                  setFromDate("");
                  setToDate("");
                  setFilterValue("");
                }}
              >
                Болдырмау
              </Button>
            </div>
          </div>

          {/* Смена видимости колонок */}
          <div className="flex flex-wrap gap-3 pt-2 border-t">
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
                  className="h-4 w-4 accent-blue-600"
                />
                <span className="text-sm">{h}</span>
              </label>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Таблица */}
      <div className="overflow-x-auto">
        <div className="min-w-[900px] overflow-y-auto max-h-[60vh] bg-white dark:bg-gray-800 rounded shadow">
          <table className="w-full table-auto text-sm">
            <thead className="sticky top-0 bg-gray-100 dark:bg-gray-700">
              <tr>
                {headers.map(
                  (h, i) =>
                    visibleCols[i] && (
                      <th
                        key={i}
                        className="px-4 py-2 text-left font-medium cursor-pointer"
                        onClick={() => {
                          if (sortCol === i) setSortAsc(!sortAsc);
                          else {
                            setSortCol(i);
                            setSortAsc(true);
                          }
                        }}
                      >
                        {h}{" "}
                        {sortCol === i && <span>{sortAsc ? "↑" : "↓"}</span>}
                      </th>
                    )
                )}
                <th className="px-4 py-2 sticky right-0 bg-gray-100 dark:bg-gray-700">
                  Әрекет
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={
                      headers.filter((_, i) => visibleCols[i]).length + 1
                    }
                    className="p-4 text-center text-gray-500 dark:text-gray-400"
                  >
                    Жазбалар табылмады
                  </td>
                </tr>
              ) : (
                filtered.map((row, ri) => (
                  <tr
                    key={ri}
                    className="odd:bg-gray-50 even:bg-white dark:odd:bg-gray-800 dark:even:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600"
                  >
                    {row.map(
                      (cell, ci) =>
                        visibleCols[ci] && (
                          <td key={ci} className="px-4 py-2 whitespace-nowrap">
                            {cell}
                          </td>
                        )
                    )}
                    <td className="px-4 py-2 sticky right-0 bg-white dark:bg-gray-800 flex space-x-2">
                      <button className="text-blue-600 hover:underline">
                        ✏️
                      </button>
                      <button className="text-red-500 hover:underline">
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Действия */}
      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={exportCSV}>
          CSV экспорт
        </Button>
        <Button
          className={ACCENT}
          onClick={() =>
            navigate("/analytics/visualize", {
              state: { headers, data: filtered },
            })
          }
        >
          Визуализация →
        </Button>
      </div>
    </div>
  );
}
