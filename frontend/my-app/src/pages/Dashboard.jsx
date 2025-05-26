import React from "react";
import { useNavigate } from "react-router-dom";
import {
  UploadCloud,
  Settings,
  UserCircle2,
  Leaf,
  ShieldCheck,
  Handshake,
  Cpu,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext"; // 👈 добавили

export default function Main() {
  const navigate = useNavigate();
  const { user } = useAuth(); // 👈 заменили localStorage

  return (
    <div className="min-h-screen w-full bg-gray-50 dark:bg-gray-900 py-10 px-4 animate-fade-in">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* Қош келдіңіз */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight leading-snug">
            Қош келдіңіз, {user?.fullname || "Қолданушы"}!
          </h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
            Бұл — басты бет. Мұнда жүйенің негізгі функцияларына жылдам өте
            аласыз.
          </p>
        </div>

        {/* 3 Негізгі функционал */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {user?.role !== "user" && ( // 👈 проверка роли
            <div
              onClick={() => navigate("/analytics/upload")}
              className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-white rounded-xl p-6 shadow-md hover:shadow-xl transition cursor-pointer"
            >
              <UploadCloud className="w-8 h-8 mb-3" />
              <h3 className="text-xl font-semibold mb-1">Деректерді жүктеу</h3>
              <p className="text-sm">
                CSV файлдарын импорттап, визуалдауды бастаңыз.
              </p>
            </div>
          )}

          <div
            onClick={() => navigate("/settings")}
            className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-white rounded-xl p-6 shadow-md hover:shadow-xl transition cursor-pointer"
          >
            <Settings className="w-8 h-8 mb-3" />
            <h3 className="text-xl font-semibold mb-1">Жүйе параметрлері</h3>
            <p className="text-sm">
              Интерфейсті және жүйе баптауларын реттеңіз.
            </p>
          </div>

          <div
            onClick={() => navigate("/profile")}
            className="bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-white rounded-xl p-6 shadow-md hover:shadow-xl transition cursor-pointer"
          >
            <UserCircle2 className="w-8 h-8 mb-3" />
            <h3 className="text-xl font-semibold mb-1">Профильді басқару</h3>
            <p className="text-sm">
              Байланыс деректерін жаңартып, өз профиліңізді реттеңіз.
            </p>
          </div>
        </div>

        {/* BCD Company — Майнинг */}
        <div className="bg-gradient-to-r from-indigo-50 to-purple-100 dark:from-gray-800 dark:to-gray-700 rounded-xl shadow p-6 text-center">
          <h2 className="text-xl font-bold text-indigo-800 dark:text-white mb-1">
            BCD Company — Криптовалюта майнингі
          </h2>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            Біз заманауи технологиялар арқылы қауіпсіз, тұрақты және тиімді
            майнинг жүргіземіз.
          </p>
        </div>

        {/* Артықшылықтар */}
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-green-300 to-teal-400 dark:from-green-700 dark:to-teal-800 text-white rounded-xl p-6 flex items-start space-x-4">
            <Leaf className="w-6 h-6 mt-1" />
            <div>
              <h3 className="text-lg font-semibold">Энергия тиімділігі</h3>
              <p className="text-sm">
                Майнинг процесін таза әрі үнемді жүргізу үшін жаңартылатын
                энергия көздерін қолданамыз.
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-lime-300 to-green-400 dark:from-lime-700 dark:to-green-800 text-white rounded-xl p-6 flex items-start space-x-4">
            <ShieldCheck className="w-6 h-6 mt-1" />
            <div>
              <h3 className="text-lg font-semibold">Құқықтық сәйкестік</h3>
              <p className="text-sm">
                Компания барлық қажетті лицензиялар мен рұқсаттарға ие және ҚР
                заңнамасына толық сәйкес жұмыс істейді.
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-300 to-indigo-400 dark:from-blue-700 dark:to-indigo-800 text-white rounded-xl p-6 flex items-start space-x-4">
            <Handshake className="w-6 h-6 mt-1" />
            <div>
              <h3 className="text-lg font-semibold">Қоғамдық жауапкершілік</h3>
              <p className="text-sm">
                Біз қоғамға қолдау көрсетіп, әлеуметтік жобаларды белсенді түрде
                қолдаймыз.
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-pink-300 to-rose-400 dark:from-pink-700 dark:to-rose-800 text-white rounded-xl p-6 flex items-start space-x-4">
            <Cpu className="w-6 h-6 mt-1" />
            <div>
              <h3 className="text-lg font-semibold">
                Инновациялық технологиялар
              </h3>
              <p className="text-sm">
                Біз майнинг индустриясындағы соңғы технологияларды тұрақты
                енгізіп, қызметімізді үздіксіз жаңартып отырамыз.
              </p>
            </div>
          </div>
        </div>

        {/* Футер */}
        <div className="pt-10 border-t border-gray-200 dark:border-gray-700 text-center text-sm text-gray-500 dark:text-gray-400 space-y-1">
          <p>
            Байланыс:{" "}
            <a
              href="mailto:support@bcdcompany.kz"
              className="text-blue-600 hover:underline"
            >
              support@bcdcompany.kz
            </a>{" "}
            | Телефон: +7 777 777 77 77
          </p>
        </div>
      </div>
    </div>
  );
}
