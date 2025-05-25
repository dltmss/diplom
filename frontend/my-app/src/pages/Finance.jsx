import React, { useState, useMemo, useEffect } from "react";
import { useMonitoring } from "../contexts/MonitoringContext";

export default function Finance() {
  /* ---------------------------- Деректер ---------------------------- */
  const { entries } = useMonitoring(); // мониторингтен келетін жазбалар

  /* --------------------------- Фильтр күйі -------------------------- */
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [deviceFilter, setDevice] = useState("");
  const [search, setSearch] = useState("");

  /* ---------------------- Есептеу параметрлері --------------------- */
  const [electricPrice, setPrice] = useState(45); // ₸ / кВт·сағ
  const [extraCosts, setExtra] = useState(0); // Қосымша шығын, ₸

  /* --------------------------- Сүзгілеу ----------------------------- */
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

  /* ----------------------- Негізгі метрикалар ---------------------- */
  const { totalEnergy, totalMined, totalIncome, totalCost, totalProfit } =
    useMemo(() => {
      let energy = 0;
      let mined = 0;
      let income = 0;
      let cost = 0;

      const BCD_USD = 1.25;
      const KZT_PER_USD = 450;

      filtered.forEach((e) => {
        const ekWh = parseFloat(e.energyKWh) || 0;
        const eff = parseFloat(e.efficiency) || 0;

        const minedNow = ekWh * eff; // шыққан BCD
        const costNow = ekWh * electricPrice; // шығын
        const incomeNow = minedNow * BCD_USD * KZT_PER_USD;

        energy += ekWh;
        mined += minedNow;
        cost += costNow;
        income += incomeNow;
      });

      const profit = income - (cost + Number(extraCosts));

      return {
        totalEnergy: energy,
        totalMined: mined,
        totalIncome: income,
        totalCost: cost + Number(extraCosts),
        totalProfit: profit,
      };
    }, [filtered, electricPrice, extraCosts]);

  /* ----------------------- Құрылғылар тізімі ----------------------- */
  const devices = useMemo(
    () => Array.from(new Set(entries.map((e) => e.device))),
    [entries]
  );

  /* -------------------------- CSV экспорт -------------------------- */
  const [csvUrl, setCsvUrl] = useState("");
  useEffect(() => {
    const header = [
      "Күні",
      "Құрылғы",
      "Энергия (кВт·сағ)",
      "Эффективтік (TH/кВт·сағ)",
      "Шыққан BCD",
      "Кіріс (₸)",
      "Шығын (₸)",
      "Пайда (₸)",
    ];

    const rows = filtered.map((e) => {
      const ekWh = parseFloat(e.energyKWh) || 0;
      const eff = parseFloat(e.efficiency) || 0;
      const mined = ekWh * eff;
      const cost = ekWh * electricPrice;
      const income = mined * 1.25 * 450;
      const profit = income - (cost + Number(extraCosts));

      return [
        e.date || e.kuni,
        e.device,
        ekWh.toFixed(2),
        eff.toFixed(2),
        mined.toFixed(4),
        income.toFixed(0),
        cost.toFixed(0),
        profit.toFixed(0),
      ];
    });

    const csv = [header, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    setCsvUrl(url);

    return () => URL.revokeObjectURL(url);
  }, [filtered, electricPrice, extraCosts]);

  /* ================================================================= */
  /*                                UI                                 */
  /* ================================================================= */

  return (
    <div className="space-y-6 py-4">
      {/* ------------------------ Фильтрлер ------------------------ */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div>
          <label className="block mb-1">Бастап</label>
          <input
            type="date"
            className="w-full border rounded p-2"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <div>
          <label className="block mb-1">Дейін</label>
          <input
            type="date"
            className="w-full border rounded p-2"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
        <div>
          <label className="block mb-1">Құрылғы</label>
          <select
            className="w-full border rounded p-2"
            value={deviceFilter}
            onChange={(e) => setDevice(e.target.value)}
          >
            <option value="">Барлығы</option>
            {devices.map((d, idx) => (
              <option key={d || idx} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block mb-1">Іздеу</label>
          <input
            type="text"
            className="w-full border rounded p-2"
            placeholder="Күні немесе құрылғы"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => {
            setStartDate("");
            setEndDate("");
            setDevice("");
            setSearch("");
          }}
          className="px-4 py-2 bg-gray-200 rounded"
        >
          Тазалау
        </button>
      </div>

      {/* ---------------------- Негізгі метрикалар ------------------- */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Metric title="Кіріс" value={totalIncome} color="text-green-600" />
        <Metric title="Шығын" value={totalCost} color="text-red-500" />
        <Metric
          title="Таза пайда"
          value={totalProfit}
          color="text-emerald-600"
        />
      </div>

      {/* ------------------------- Экспорт --------------------------- */}
      <a
        href={csvUrl}
        download={`finance_${Date.now()}.csv`}
        className="inline-block px-4 py-2 bg-green-600 text-white rounded"
      >
        CSV экспорттау
      </a>

      {/* ------------------------- Кесте ----------------------------- */}
      <div className="overflow-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              {[
                "Күні",
                "Құрылғы",
                "Энергия (кВт·сағ)",
                "Эффективтік (TH/кВт·сағ)",
                "Шыққан BCD",
                "Кіріс (₸)",
                "Шығын (₸)",
                "Пайда (₸)",
              ].map((col) => (
                <th key={col} className="px-3 py-2">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((e) => {
              const ekWh = parseFloat(e.energyKWh) || 0;
              const eff = parseFloat(e.efficiency) || 0;
              const mined = ekWh * eff;
              const cost = ekWh * electricPrice;
              const income = mined * 1.25 * 450;
              const profit = income - (cost + Number(extraCosts));

              return (
                <tr key={e.id} className="border-b hover:bg-gray-50">
                  <td className="px-3 py-1">{e.date || e.kuni}</td>
                  <td className="px-3 py-1">{e.device}</td>
                  <td className="px-3 py-1">{ekWh.toFixed(2)}</td>
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

/* ------------------------------------------------------------------ */
/*                              helper                                */
/* ------------------------------------------------------------------ */
function Metric({ title, value, color }) {
  return (
    <div className="border rounded p-4">
      <h2 className="font-semibold">{title}</h2>
      <p className={`text-2xl ${color}`}>₸ {value.toFixed(0)}</p>
    </div>
  );
}
