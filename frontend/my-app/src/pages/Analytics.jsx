import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, BarChart3, Clock } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// Данные для графика
const data = [
  { name: "Янв", value: 400 },
  { name: "Фев", value: 600 },
  { name: "Мар", value: 800 },
  { name: "Апр", value: 700 },
  { name: "Май", value: 900 },
  { name: "Июн", value: 1000 },
];

// Данные для карточек
const stats = [
  { title: "Активные пользователи", value: "320", icon: Users },
  { title: "Запросов обработано", value: "1 240", icon: BarChart3 },
  { title: "Среднее время ответа", value: "0.76 сек", icon: Clock },
];

export default function Analytics() {
  return (
    <div className="space-y-6">
      {/* Заголовок страницы */}
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
        Аналитика данных
      </h1>

      {/* Карточки */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <Card
            key={stat.title}
            className="transition-all duration-300 hover:shadow-lg dark:hover:shadow-xl"
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-300">
                {stat.title}
              </CardTitle>
              <stat.icon className="w-4 h-4 text-gray-400 dark:text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-800 dark:text-white">
                {stat.value}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* График */}
      <div className="mt-10">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
          Динамика по месяцам
        </h2>
        <div className="h-64 bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
              <XAxis dataKey="name" stroke="#8884d8" />
              <YAxis stroke="#8884d8" />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
