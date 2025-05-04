// src/pages/Finance.jsx
import React, { useMemo } from "react";
import { useMonitoring } from "../contexts/MonitoringContext.jsx";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../components/ui/card";
import {
  LineChart,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Line,
  Legend,
} from "recharts";

export default function Finance() {
  const { entries } = useMonitoring();

  // Ставки (тенге)
  const REVENUE_PER_TH = 5; // доход на 1 TH/s в день
  const COST_PER_KWH = 20; // стоимость 1 kWh

  // Вычисляем общие доходы, расходы и данные для графика по датам
  const { totalRevenue, totalCost, chartData } = useMemo(() => {
    let totalRevenue = 0;
    let totalCost = 0;
    const byDate = {};

    entries.forEach((e) => {
      const hashrate = parseFloat(e.hashrate) || 0; // TH/s
      const energy = parseFloat(e.energyDay) || 0; // kWh/день
      const rev = hashrate * REVENUE_PER_TH; // тенге/день
      const cost = energy * COST_PER_KWH; // тенге/день

      totalRevenue += rev;
      totalCost += cost;

      const date = e.date;
      if (!byDate[date]) {
        byDate[date] = { date, revenue: 0, cost: 0 };
      }
      byDate[date].revenue += rev;
      byDate[date].cost += cost;
    });

    // Сортируем по дате для графика
    const chartData = Object.values(byDate).sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );

    return { totalRevenue, totalCost, chartData };
  }, [entries]);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
        Қаражаттар
      </h1>

      {/* KPI-карточки */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Жалпы табыс</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-extrabold text-green-600">
            {totalRevenue.toFixed(2)} ₸
          </CardContent>
        </Card>
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Жалпы шығын</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-extrabold text-red-600">
            {totalCost.toFixed(2)} ₸
          </CardContent>
        </Card>
      </div>

      {/* График доходов/расходов по дням */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Күнделікті табыс және шығын</CardTitle>
        </CardHeader>
        <CardContent style={{ height: 300 }}>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData}
                margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
              >
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip formatter={(value) => `${value.toFixed(2)} ₸`} />
                <Legend verticalAlign="top" height={36} />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  name="Табыс"
                  stroke="#10B981"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
                <Line
                  type="monotone"
                  dataKey="cost"
                  name="Шығын"
                  stroke="#EF4444"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-center text-gray-500 dark:text-gray-400">
              Деректер жоқ
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
