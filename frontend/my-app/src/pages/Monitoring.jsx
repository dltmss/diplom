// src/pages/Monitoring.jsx
import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectItem,
} from "../components/ui/select";
import { Download, Trash2, Edit2 } from "lucide-react";

export default function Monitoring() {
  const equipmentList = [
    { code: "EQ-1001", name: "Жабдық 1" },
    { code: "EQ-1002", name: "Жабдық 2" },
    { code: "EQ-1003", name: "Жабдық 3" },
    { code: "EQ-1004", name: "Жабдық 4" },
    { code: "EQ-1005", name: "Жабдық 5" },
  ];

  const initForm = {
    eq: equipmentList[0].code,
    date: "",
    asic: "",
    fan: "",
    loadCore: "",
    loadMem: "",
    loadDisk: "",
    powerNow: "",
    energyDay: "",
    hashrate: "",
    efficiency: "",
    uptime: "",
    errHw: "",
    errInvalid: "",
    activePct: "",
  };

  const [form, setForm] = useState(initForm);
  const [records, setRecords] = useState([]);
  const [editIdx, setEditIdx] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const saveRecord = () => {
    if (!form.date) return;
    if (editIdx === null) {
      setRecords((r) => [...r, { ...form }]);
    } else {
      setRecords((r) => r.map((rec, i) => (i === editIdx ? { ...form } : rec)));
    }
    setForm(initForm);
    setEditIdx(null);
  };

  const editRecord = (idx) => {
    setForm(records[idx]);
    setEditIdx(idx);
  };

  const deleteRecord = (idx) => {
    setRecords((r) => r.filter((_, i) => i !== idx));
    if (editIdx === idx) {
      setForm(initForm);
      setEditIdx(null);
    }
  };

  const exportCSV = () => {
    if (!records.length) return;
    const header = [
      "Жабдық",
      "Күні",
      "ASIC(°C)",
      "Вентилятор(%)",
      "Ядро(%)",
      "Жад(%)",
      "Диск(%)",
      "Энергия(Вт)",
      "Энергия(кВт·сағ)",
      "Hashrate(TH/s)",
      "Эффективтік(TH/kWh)",
      "Uptime(сағ)",
      "HW қате",
      "Invalid shares",
      "Белсенді(%)",
    ];
    const rows = records.map((r) => [
      r.eq,
      r.date,
      r.asic,
      r.fan,
      r.loadCore,
      r.loadMem,
      r.loadDisk,
      r.powerNow,
      r.energyDay,
      r.hashrate,
      r.efficiency,
      r.uptime,
      r.errHw,
      r.errInvalid,
      r.activePct,
    ]);
    const csv = [header, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `monitoring_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 p-4">
      {/* Form */}
      <Card className="bg-gray-50 dark:bg-gray-900 border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-800 dark:text-gray-100">
            Мониторинг жазбасын қосу / өзгерту
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          <Select
            value={form.eq}
            onValueChange={(val) => setForm((f) => ({ ...f, eq: val }))}
          >
            <SelectTrigger className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded">
              <SelectValue placeholder="Жабдық" />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-gray-800">
              <SelectGroup>
                <SelectLabel className="text-gray-600 dark:text-gray-400">
                  Жабдық
                </SelectLabel>
                {equipmentList.map((eq) => (
                  <SelectItem key={eq.code} value={eq.code}>
                    {eq.name} ({eq.code})
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>

          <Input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            className="w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-700 rounded"
          />

          <Input
            name="asic"
            value={form.asic}
            onChange={handleChange}
            placeholder="ASIC(°C)"
            className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-700 rounded"
          />

          <Input
            name="fan"
            value={form.fan}
            onChange={handleChange}
            placeholder="Вентилятор(%)"
            className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-700 rounded"
          />

          <Input
            name="loadCore"
            value={form.loadCore}
            onChange={handleChange}
            placeholder="Ядро(%)"
            className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-700 rounded"
          />

          <Input
            name="loadMem"
            value={form.loadMem}
            onChange={handleChange}
            placeholder="Жад(%)"
            className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-700 rounded"
          />

          <Input
            name="loadDisk"
            value={form.loadDisk}
            onChange={handleChange}
            placeholder="Диск(%)"
            className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-700 rounded"
          />

          <Input
            name="powerNow"
            value={form.powerNow}
            onChange={handleChange}
            placeholder="Энергия(Вт)"
            className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-700 rounded"
          />

          <Input
            name="energyDay"
            value={form.energyDay}
            onChange={handleChange}
            placeholder="Энергия(кВт·сағ)"
            className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-700 rounded"
          />

          <Input
            name="hashrate"
            value={form.hashrate}
            onChange={handleChange}
            placeholder="Hashrate(TH/s)"
            className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-700 rounded"
          />

          <Input
            name="efficiency"
            value={form.efficiency}
            onChange={handleChange}
            placeholder="Эффективтік(TH/kWh)"
            className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-700 rounded"
          />

          <Input
            name="uptime"
            value={form.uptime}
            onChange={handleChange}
            placeholder="Uptime(сағ)"
            className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-700 rounded"
          />

          <Input
            name="errHw"
            value={form.errHw}
            onChange={handleChange}
            placeholder="HW қате"
            className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-700 rounded"
          />

          <Input
            name="errInvalid"
            value={form.errInvalid}
            onChange={handleChange}
            placeholder="Invalid shares"
            className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-700 rounded"
          />

          <Input
            name="activePct"
            value={form.activePct}
            onChange={handleChange}
            placeholder="Белсенді(%)"
            className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-700 rounded"
          />

          <div className="col-span-full flex justify-end gap-2 mt-2">
            <Button
              onClick={saveRecord}
              className="bg-[var(--accent-color)] hover:brightness-110 text-white"
            >
              {editIdx === null ? "Қосу" : "Жаңарту"}
            </Button>
            <Button
              variant="outline"
              onClick={exportCSV}
              className="border-[var(--accent-color)] text-[var(--accent-color)] hover:bg-[var(--accent-color)] hover:text-white"
            >
              <Download className="w-4 h-4 inline-block mr-1" />
              CSV экспорт
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Scrollable table */}
      <div className="overflow-x-auto bg-white dark:bg-gray-900 rounded-lg shadow-lg">
        <div className="overflow-y-auto max-h-[360px] min-w-[1200px]">
          <table className="w-full divide-y dark:divide-gray-700">
            <thead className="bg-[var(--accent-color)] dark:bg-[var(--accent-color)]/80">
              <tr>
                {[
                  "Жабдық",
                  "Күні",
                  "ASIC",
                  "Вентилятор",
                  "Ядро",
                  "Жад",
                  "Диск",
                  "Энергия(Вт)",
                  "Энергия(кВт·сағ)",
                  "Hashrate",
                  "Эффективтік",
                  "Uptime",
                  "HW қате",
                  "Invalid",
                  "Белсенді",
                  "Әрекет",
                ].map((h, idx) => (
                  <th
                    key={idx}
                    className="px-3 py-2 text-left text-sm font-medium text-white whitespace-nowrap"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y dark:divide-gray-700 bg-gray-50 dark:bg-gray-800">
              {records.length === 0 && (
                <tr>
                  <td
                    colSpan={16}
                    className="p-4 text-center text-gray-500 dark:text-gray-400"
                  >
                    Жазбалар жоқ
                  </td>
                </tr>
              )}
              {records.map((r, i) => (
                <tr
                  key={i}
                  className="hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <td className="px-3 py-2 whitespace-nowrap">{r.eq}</td>
                  <td className="px-3 py-2 whitespace-nowrap">{r.date}</td>
                  <td className="px-3 py-2 whitespace-nowrap">{r.asic}</td>
                  <td className="px-3 py-2 whitespace-nowrap">{r.fan}</td>
                  <td className="px-3 py-2 whitespace-nowrap">{r.loadCore}</td>
                  <td className="px-3 py-2 whitespace-nowrap">{r.loadMem}</td>
                  <td className="px-3 py-2 whitespace-nowrap">{r.loadDisk}</td>
                  <td className="px-3 py-2 whitespace-nowrap">{r.powerNow}</td>
                  <td className="px-3 py-2 whitespace-nowrap">{r.energyDay}</td>
                  <td className="px-3 py-2 whitespace-nowrap">{r.hashrate}</td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    {r.efficiency}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">{r.uptime}</td>
                  <td className="px-3 py-2 whitespace-nowrap">{r.errHw}</td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    {r.errInvalid}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">{r.activePct}</td>
                  <td className="px-3 py-2 whitespace-nowrap flex gap-2">
                    <button onClick={() => editRecord(i)}>
                      <Edit2 className="w-5 h-5 text-[var(--accent-color)] hover:text-[var(--accent-color)]/80" />
                    </button>
                    <button onClick={() => deleteRecord(i)}>
                      <Trash2 className="w-5 h-5 text-red-500 hover:text-red-600" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
