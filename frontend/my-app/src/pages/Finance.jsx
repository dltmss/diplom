// src/pages/Finance.jsx
import React, { useState, useMemo, useEffect } from "react";
import { useMonitoring } from "../contexts/MonitoringContext.jsx";
import { Button } from "../components/ui/button.jsx";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "../components/ui/table.jsx";

export default function Finance() {
  const { entries } = useMonitoring();

  // —— Фильтры ——
  const [inpStart, setInpStart] = useState("");
  const [inpEnd, setInpEnd] = useState("");
  const [inpDev, setInpDev] = useState("");
  const [inpSearch, setInpSearch] = useState("");

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [deviceFilter, setDeviceFilter] = useState("");
  const [search, setSearch] = useState("");

  // —— Настройки расчёта ——
  const [electricPrice, setElectricPrice] = useState(45);
  const [extraCosts, setExtraCosts] = useState(0);
  const [bcdPriceUSD, setBcdPriceUSD] = useState(1.25);
  const [exchangeRate, setExchangeRate] = useState(450);

  // —— Список устройств для селекта ——
  const devices = useMemo(
    () => Array.from(new Set(entries.map((e) => e.name))),
    [entries]
  );

  // —— Отфильтрованные записи ——
  const filtered = useMemo(() => {
    return entries.filter((e) => {
      if (startDate && e.date < startDate) return false;
      if (endDate && e.date > endDate) return false;
      if (deviceFilter && e.name !== deviceFilter) return false;
      const term = search.trim().toLowerCase();
      if (
        term &&
        !(
          e.name.toLowerCase().includes(term) ||
          e.date.toLowerCase().includes(term)
        )
      )
        return false;
      return true;
    });
  }, [entries, startDate, endDate, deviceFilter, search]);

  // —— KPI: доход, расход, прибыль ——
  const { totalIncome, totalCost, totalProfit } = useMemo(() => {
    let inc = 0,
      cost = 0;
    filtered.forEach((e) => {
      const ekWh = parseFloat(e.energy_kvt) || 0;
      const eff = parseFloat(e.efficiency) || 0;
      const mined = ekWh * eff;
      cost += ekWh * electricPrice;
      inc += mined * bcdPriceUSD * exchangeRate;
    });
    const fullCost = cost + Number(extraCosts);
    return {
      totalIncome: inc,
      totalCost: fullCost,
      totalProfit: inc - fullCost,
    };
  }, [filtered, electricPrice, extraCosts, bcdPriceUSD, exchangeRate]);

  // —— CSV экспорт ——
  const [csvUrl, setCsvUrl] = useState("");
  useEffect(() => {
    const header = [
      "Күні",
      "Құрылғы",
      "Энергия (Вт)",
      "Энергия (кВт·сағ)",
      "Hashrate (TH/s)",
      "Эффективтік (TH/kWh)",
      "Uptime (сағ)",
      "HW қате",
      "Белсенді (%)",
    ];

    const rows = filtered.map((e) => [
      e.date,
      e.name,
      (parseFloat(e.energy_w) || 0).toFixed(0),
      (parseFloat(e.energy_kvt) || 0).toFixed(2),
      (parseFloat(e.hashrate) || 0).toFixed(2),
      (parseFloat(e.efficiency) || 0).toFixed(2),
      e.uptime || 0,
      e.hw_error || 0,
      e.active_percent || 0,
    ]);

    const csv = [header, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    setCsvUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [filtered]);

  return (
    <div className="space-y-6 p-6 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Фильтры */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {/* Бастап */}
        <div>
          <label className="block mb-1">Бастап</label>
          <input
            type="date"
            className="w-full border rounded p-2 bg-white dark:bg-gray-800"
            value={inpStart}
            onChange={(e) => setInpStart(e.target.value)}
          />
        </div>
        {/* Дейін */}
        <div>
          <label className="block mb-1">Дейін</label>
          <input
            type="date"
            className="w-full border rounded p-2 bg-white dark:bg-gray-800"
            value={inpEnd}
            onChange={(e) => setInpEnd(e.target.value)}
          />
        </div>
        {/* Құрылғы */}
        <div>
          <label className="block mb-1">Құрылғы</label>
          <select
            className="w-full border rounded p-2 bg-white dark:bg-gray-800"
            value={inpDev}
            onChange={(e) => setInpDev(e.target.value)}
          >
            <option value="">Барлығы</option>
            {devices.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>
        {/* Іздеу */}
        <div>
          <label className="block mb-1">Іздеу</label>
          <input
            type="text"
            placeholder="Күні немесе құрылғы"
            className="w-full border rounded p-2 bg-white dark:bg-gray-800"
            value={inpSearch}
            onChange={(e) => setInpSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Кнопки */}
      <div className="flex gap-2">
        <Button
          variant="outline"
          onClick={() => {
            setInpStart("");
            setInpEnd("");
            setInpDev("");
            setInpSearch("");
            setStartDate("");
            setEndDate("");
            setDeviceFilter("");
            setSearch("");
          }}
          className="border-blue-600 text-blue-600 dark:text-blue-400"
        >
          Тазалау
        </Button>
        <Button
          onClick={() => {
            setStartDate(inpStart);
            setEndDate(inpEnd);
            setDeviceFilter(inpDev);
            setSearch(inpSearch);
          }}
          className="bg-blue-600 text-white dark:bg-blue-500"
        >
          Қолдану
        </Button>
      </div>

      {/* Параметры расчёта */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div>
          <label className="block mb-1">Электр тарифі (₸/кВт·сағ)</label>
          <input
            type="number"
            min="0"
            className="w-full border rounded p-2 bg-white dark:bg-gray-800"
            value={electricPrice}
            onChange={(e) => setElectricPrice(+e.target.value)}
          />
        </div>
        <div>
          <label className="block mb-1">Қосымша шығындар (₸)</label>
          <input
            type="number"
            min="0"
            className="w-full border rounded p-2 bg-white dark:bg-gray-800"
            value={extraCosts}
            onChange={(e) => setExtraCosts(+e.target.value)}
          />
        </div>
        <div>
          <label className="block mb-1">BCD бағасы (USD)</label>
          <input
            type="number"
            step="0.01"
            className="w-full border rounded p-2 bg-white dark:bg-gray-800"
            value={bcdPriceUSD}
            onChange={(e) => setBcdPriceUSD(+e.target.value)}
          />
        </div>
        <div>
          <label className="block mb-1">Курс USD→₸</label>
          <input
            type="number"
            className="w-full border rounded p-2 bg-white dark:bg-gray-800"
            value={exchangeRate}
            onChange={(e) => setExchangeRate(+e.target.value)}
          />
        </div>
      </div>

      {/* KPI */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <KpiCard title="Кіріс" value={totalIncome} color="text-green-600" />
        <KpiCard title="Шығын" value={totalCost} color="text-red-500" />
        <KpiCard
          title="Таза пайда"
          value={totalProfit}
          color="text-emerald-600"
        />
      </div>

      {/* CSV экспорт */}
      <Button
        as="a"
        href={csvUrl}
        download={`finance_${Date.now()}.csv`}
        className="bg-blue-600 text-white dark:bg-blue-500"
      >
        CSV экспорттау
      </Button>

      {/* Таблица в стиле «Мониторинг» */}
      <div className="overflow-auto border rounded">
        <Table className="min-w-full">
          <TableHeader className="bg-gray-100 dark:bg-gray-700">
            <TableRow>
              <TableHead>Жабдық</TableHead>
              <TableHead>Күні</TableHead>
              <TableHead>Энергия (Вт)</TableHead>
              <TableHead>Энергия (кВт·сағ)</TableHead>
              <TableHead>Hashrate (TH/s)</TableHead>
              <TableHead>Эффективтік (TH/kWh)</TableHead>
              <TableHead>Uptime (сағ)</TableHead>
              <TableHead>HW қате</TableHead>
              <TableHead>Белсенді (%)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((e) => (
              <TableRow
                key={e.id}
                className="odd:bg-white even:bg-gray-50 dark:odd:bg-gray-800 dark:even:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600"
              >
                <TableCell>{e.name}</TableCell>
                <TableCell>{e.date}</TableCell>
                <TableCell>
                  {(parseFloat(e.energy_w) || 0).toFixed(0)} W
                </TableCell>
                <TableCell>
                  {(parseFloat(e.energy_kvt) || 0).toFixed(2)}
                </TableCell>
                <TableCell>
                  {(parseFloat(e.hashrate) || 0).toFixed(2)}
                </TableCell>
                <TableCell>
                  {(parseFloat(e.efficiency) || 0).toFixed(2)}
                </TableCell>
                <TableCell>{e.uptime || 0} сағ</TableCell>
                <TableCell>{e.hw_error || 0}</TableCell>
                <TableCell>{e.active_percent || 0}%</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

// KPI-карточка
function KpiCard({ title, value, color }) {
  return (
    <div className="border rounded p-4 bg-white dark:bg-gray-800">
      <h3 className="font-semibold">{title}</h3>
      <p className={`text-2xl ${color}`}>₸ {value.toFixed(0)}</p>
    </div>
  );
}
