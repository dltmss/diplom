// src/pages/AnalyticsHome.jsx

import React, { useState } from "react";
import { Upload } from "lucide-react";

export default function AnalyticsHome() {
  const [username] = useState("Айгүл"); // допустим, имя приходит из сессии или профиля

  const buttons = [
    "Аккаунттар туралы шолу",
    "Адамдар туралы талдау",
    "Тапсырыстар бойынша қорытынды",
    "Аналитикалық оқиғаларға көз жүгірту",
    "Өнімдерге көз жүгірту",
    "Кері байланысты шолу",
    "Шот-фактуралар қорытындысы",
    "Пікірлер туралы түсініктер",
  ];

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-semibold mb-6">
          Қалыңыз қалай, {username}? 👋
        </h1>

        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-2">
            Өз деректеріңізді жүктеңіз
          </h2>
          <div className="flex items-center gap-4">
            <input
              type="file"
              accept=".csv, .xlsx"
              className="border border-gray-300 px-4 py-2 rounded-md bg-white shadow-sm w-72"
            />
            <button className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-blue-700 transition">
              <Upload className="w-4 h-4" /> Жүктеу
            </button>
          </div>
        </div>

        <div>
          <p className="text-sm text-gray-600 mb-4">
            Біздің платформа не істей алатынын көру үшін төмендегі үлгі
            панельдерді басыңыз:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {buttons.map((text, index) => (
              <button
                key={index}
                className="border border-gray-300 rounded-lg px-6 py-4 bg-white shadow-sm hover:shadow-md transition flex items-center gap-2"
              >
                <span className="text-yellow-500">💡</span>
                <span className="text-sm">{text}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-12">
          <h3 className="text-sm text-gray-500 font-medium mb-2 uppercase">
            ЖИНАҚТАМАЛАР
          </h3>
          <div className="flex flex-col gap-1 text-sm text-blue-600">
            <span className="cursor-pointer hover:underline">
              Біздің аналитика
            </span>
            <span className="cursor-pointer hover:underline">
              Жеке жинақтамаңыз
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
