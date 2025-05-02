// src/pages/AnalyticsFilter.jsx
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card, CardContent } from "../components/ui/card.jsx";
import { Button } from "../components/ui/button.jsx";
import { Input } from "../components/ui/input.jsx";
// Обратите внимание на .jsx в конце
import DataTable from "../components/ui/DataTable.jsx";

export default function AnalyticsFilter() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { headers, data } = state || {};

  const [colIndex, setColIndex] = useState(0);
  const [filterValue, setFilterValue] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    if (data) setFilteredData(data);
  }, [data]);

  if (!headers || !data) {
    return (
      <div className="p-6">
        <Button variant="link" onClick={() => navigate("/analytics/upload")}>
          ← Файлды қайта жүктеу
        </Button>
        <p className="mt-4 text-gray-600">Деректер табылмады.</p>
      </div>
    );
  }

  const applyFilter = () => {
    const newData = data.filter((row) =>
      String(row[colIndex] ?? "").includes(filterValue)
    );
    setFilteredData(newData);
  };

  const resetFilter = () => {
    setFilterValue("");
    setFilteredData(data);
  };

  return (
    <div className="p-6">
      <Card className="mb-6">
        <CardContent className="space-y-4">
          <Button variant="link" onClick={() => navigate("/analytics/upload")}>
            ← Файлды қайта жүктеу
          </Button>

          <div className="flex flex-col md:flex-row md:items-end gap-4 overflow-x-auto pb-2">
            <div className="flex-1 min-w-[150px]">
              <label className="block mb-1 font-medium">Баган (Колонка)</label>
              <select
                value={colIndex}
                onChange={(e) => setColIndex(Number(e.target.value))}
                className="w-full border rounded px-2 py-1"
              >
                {headers.map((h, i) => (
                  <option key={i} value={i}>
                    {h}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex-1 min-w-[150px]">
              <label className="block mb-1 font-medium">Мән (Значение)</label>
              <Input
                value={filterValue}
                onChange={(e) => setFilterValue(e.target.value)}
                placeholder="Мәтінді енгізіңіз"
                className="w-full"
              />
            </div>

            <div className="flex gap-2">
              <Button onClick={applyFilter}>Қолдану</Button>
              <Button variant="outline" onClick={resetFilter}>
                Болдырмау
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <DataTable headers={headers} data={filteredData} />

      <div className="mt-4 flex justify-end">
        <Button
          onClick={() =>
            navigate("/analytics/visualize", {
              state: { headers, data: filteredData },
            })
          }
        >
          Визуализацияға өту →
        </Button>
      </div>
    </div>
  );
}
