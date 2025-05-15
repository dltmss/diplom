import React, { useState, useMemo, useEffect } from "react";
import { useMonitoring } from "../contexts/MonitoringContext";

export default function Finance() {
  const { entries } = useMonitoring();

  // Фильтры
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [deviceFilter, setDeviceFilter] = useState("");
  const [search, setSearch] = useState("");

  // Параметры расчёта
  const [electricPrice, setElectricPrice] = useState(45); // ₸/kWh
  const [extraCosts, setExtraCosts] = useState(0); // ₸

  // Фильтрация записей
  const filtered = useMemo(() => {
    return entries.filter((e) => {
      const date = e.date || e.kuni;
      if (startDate && date < startDate) return false;
      if (endDate && date > endDate) return false;
      if (deviceFilter && e.device !== deviceFilter) return false;
      const term = search.toLowerCase();
      if (
        term &&
        !(e.device.toLowerCase().includes(term) || date.includes(term))
      )
        return false;
      return true;
    });
  }, [entries, startDate, endDate, deviceFilter, search]);

  // Расчёты ключевых метрик
  const { totalEnergy, totalMinedBCD, totalIncome, totalCost, totalProfit } =
    useMemo(() => {
      let energySum = 0;
      let bcdSum = 0;
      let incomeSum = 0;
      let costSum = 0;
      const bcdPriceUSD = 1.25;
      const exchangeRate = 450;
      filtered.forEach((e) => {
        const ekwh = parseFloat(e.energyKWh) || 0;
        const eff = parseFloat(e.efficiency) || 0;
        const mined = ekwh * eff;
        const cost = ekwh * electricPrice;
        const income = mined * bcdPriceUSD * exchangeRate;
        energySum += ekwh;
        bcdSum += mined;
        costSum += cost;
        incomeSum += income;
      });
      const profit = incomeSum - (costSum + Number(extraCosts));
      return {
        totalEnergy: energySum,
        totalMinedBCD: bcdSum,
        totalIncome: incomeSum,
        totalCost: costSum + Number(extraCosts),
        totalProfit: profit,
      };
    }, [filtered, electricPrice, extraCosts]);

  // Список устройств
  const devices = useMemo(
    () => Array.from(new Set(entries.map((e) => e.device))),
    [entries]
  );

  // Генерация CSV-файла вручную
  const [csvUrl, setCsvUrl] = useState("");
  useEffect(() => {
    const header = [
      "Күні",
      "Құрылғы",
      "Энергия (кВт·ч)",
      "Эффективтік (TH/kWh)",
      "Добыто BCD",
      "Доход (₸)",
      "Расход (₸)",
      "Пайда (₸)",
    ];
    const rows = filtered.map((e) => {
      const ekwh = parseFloat(e.energyKWh) || 0;
      const eff = parseFloat(e.efficiency) || 0;
      const mined = ekwh * eff;
      const cost = ekwh * electricPrice;
      const income = mined * 1.25 * 450;
      const profit = income - (cost + Number(extraCosts));
      return [
        e.date || e.kuni,
        e.device,
        ekwh.toFixed(2),
        eff.toFixed(2),
        mined.toFixed(4),
        income.toFixed(0),
        cost.toFixed(0),
        profit.toFixed(0),
      ];
    });
    const csvContent = [header, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    setCsvUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [filtered, electricPrice, extraCosts]);

  return (
    <div className="space-y-8 py-4">
      <h1 className="text-3xl font-bold">Қаражаттар</h1>

      {/* Фильтры */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div>
          <label className="block">Бастап</label>
          <input
            type="date"
            className="w-full border rounded p-2"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <div>
          <label className="block">Дейін</label>
          <input
            type="date"
            className="w-full border rounded p-2"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
        <div>
          <label className="block">Құрылғы</label>
          <select
            className="w-full border rounded p-2"
            value={deviceFilter}
            onChange={(e) => setDeviceFilter(e.target.value)}
          >
            <option value="">Барлығы</option>
            {devices.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block">Іздеу</label>
          <input
            type="text"
            placeholder="Дата немесе құрылғы"
            className="w-full border rounded p-2"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>
      <div className="flex gap-2">
        <button
          className="px-4 py-2 bg-gray-200 rounded"
          onClick={() => {
            setStartDate("");
            setEndDate("");
            setDeviceFilter("");
            setSearch("");
          }}
        >
          Тазалау
        </button>
        <button className="px-4 py-2 bg-blue-600 text-white rounded">
          Қолдану
        </button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="border rounded p-4">
          <h2 className="font-semibold">Доход</h2>
          <p className="text-2xl text-green-600">₸ {totalIncome.toFixed(0)}</p>
        </div>
        <div className="border rounded p-4">
          <h2 className="font-semibold">Расход</h2>
          <p className="text-2xl text-red-500">₸ {totalCost.toFixed(0)}</p>
        </div>
        <div className="border rounded p-4">
          <h2 className="font-semibold">Таза пайда</h2>
          <p className="text-2xl text-emerald-600">
            ₸ {totalProfit.toFixed(0)}
          </p>
        </div>
      </div>

      {/* Экспорт */}
      <div>
        <a
          href={csvUrl}
          download={`finance_${Date.now()}.csv`}
          className="px-4 py-2 bg-green-600 text-white rounded"
        >
          CSV экспорт
        </a>
        <button
          className="ml-2 px-4 py-2 bg-blue-600 text-white rounded"
          disabled
        >
          XLS экспорт
        </button>
        <button
          className="ml-2 px-4 py-2 bg-red-600 text-white rounded"
          disabled
        >
          PDF экспорт
        </button>
      </div>

      {/* Таблица */}
      <div className="overflow-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              {[
                { label: "Күні", field: "date" },
                { label: "Құрылғы", field: "device" },
                { label: "Энергия (кВт·ч)", field: "energyKWh" },
                { label: "Эффективтік (TH/kWh)", field: "efficiency" },
                { label: "Добыто BCD", field: "minedBCD" },
                { label: "Доход (₸)", field: "income" },
                { label: "Расход (₸)", field: "cost" },
                { label: "Пайда (₸)", field: "profit" },
              ].map((col) => (
                <th key={col.field} className="px-3 py-2">
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((e) => {
              const ekwh = parseFloat(e.energyKWh) || 0;
              const eff = parseFloat(e.efficiency) || 0;
              const mined = ekwh * eff;
              const cost = ekwh * electricPrice;
              const income = mined * 1.25 * 450;
              const profit = income - (cost + Number(extraCosts));
              return (
                <tr key={e.id} className="border-b hover:bg-gray-50">
                  <td className="px-3 py-1">{e.date || e.kuni}</td>
                  <td className="px-3 py-1">{e.device}</td>
                  <td className="px-3 py-1">{ekwh.toFixed(2)}</td>
                  <td className="px-3 py-1">{eff.toFixed(2)}</td>
                  <td className="px-3 py-1">{mined.toFixed(4)}</td>
                  <td className="px-3 py-1">₸{income.toFixed(0)}</td>
                  <td className="px-3 py-1">₸{cost.toFixed(0)}</td>
                  <td className="px-3 py-1">₸{profit.toFixed(0)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
