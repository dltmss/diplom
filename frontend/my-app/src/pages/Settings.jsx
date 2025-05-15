// src/pages/Settings.jsx
import React, { useState, useEffect } from "react";
import { useSettings } from "../contexts/SettingsContext.jsx";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../components/ui/select";
import { Clock, Type, Globe, Text } from "lucide-react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "../components/ui/dialog";

export default function SettingsPage() {
  // 1) Из контекста SettingsProvider достаём глобальные настройки
  const { settings, setSettings } = useSettings();

  // 2) Локальный draft для формы (для возможности отмены)
  const [draft, setDraft] = useState(settings);

  // Если глобальные settings изменились извне — синхронизируем draft
  useEffect(() => {
    setDraft(settings);
  }, [settings]);

  const [isSaveOpen, setIsSaveOpen] = useState(false);
  const [isResetOpen, setIsResetOpen] = useState(false);

  const TIMEOUTS = [5, 15, 30, 60];
  const FONTS = [
    { value: "sans-serif", label: "Sans-serif" },
    { value: "serif", label: "Serif" },
    { value: "monospace", label: "Monospace" },
  ];
  const LANGS = [
    { value: "kz", label: "Қазақша" },
    { value: "ru", label: "Русский" },
    { value: "en", label: "English" },
  ];
  const TIME_FORMATS = [
    { value: "12", label: "12 сағаттық" },
    { value: "24", label: "24 сағаттық" },
  ];

  // Обновить одно поле в draft
  const upd = (key, val) => {
    setDraft((d) => ({ ...d, [key]: val }));
  };

  // Отмена всех изменений: просто возвращаем draft к текущим глобальным settings
  const handleReset = () => {
    setDraft(settings);
    setIsResetOpen(false);
  };

  // Сохранить: записываем draft в контекст и localStorage
  const handleSave = () => {
    setSettings(draft);
    localStorage.setItem("settings", JSON.stringify(draft));
    setIsSaveOpen(false);
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900 pt-4 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Авто-шығу */}
          <Card className="rounded-lg shadow bg-white dark:bg-gray-800">
            <CardHeader className="flex flex-col items-center pt-6 pb-0">
              <Clock className="w-6 h-6 text-indigo-500" />
              <CardTitle className="mt-2 text-lg font-semibold text-gray-800 dark:text-gray-100">
                Авто-шығу (минут)
              </CardTitle>
            </CardHeader>
            <CardContent className="px-6 pb-6">
              <Select
                value={String(draft.idleTimeout)}
                onValueChange={(v) => upd("idleTimeout", Number(v))}
              >
                <SelectTrigger className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-indigo-300">
                  <SelectValue placeholder={`${draft.idleTimeout} минут`} />
                </SelectTrigger>
                <SelectContent>
                  {TIMEOUTS.map((m) => (
                    <SelectItem key={m} value={String(m)}>
                      {m} минут
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Уақыт форматы */}
          <Card className="rounded-lg shadow bg-white dark:bg-gray-800">
            <CardHeader className="flex flex-col items-center pt-6 pb-0">
              <Clock className="w-6 h-6 text-indigo-500" />
              <CardTitle className="mt-2 text-lg font-semibold text-gray-800 dark:text-gray-100">
                Уақыт форматы
              </CardTitle>
            </CardHeader>
            <CardContent className="px-6 pb-6">
              <Select
                value={draft.timeFormat}
                onValueChange={(v) => upd("timeFormat", v)}
              >
                <SelectTrigger className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-indigo-300">
                  <SelectValue placeholder="Форматты таңдаңыз" />
                </SelectTrigger>
                <SelectContent>
                  {TIME_FORMATS.map((f) => (
                    <SelectItem key={f.value} value={f.value}>
                      {f.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Шрифт */}
          <Card className="rounded-lg shadow bg-white dark:bg-gray-800">
            <CardHeader className="flex flex-col items-center pt-6 pb-0">
              <Type className="w-6 h-6 text-indigo-500" />
              <CardTitle className="mt-2 text-lg font-semibold text-gray-800 dark:text-gray-100">
                Шрифт
              </CardTitle>
            </CardHeader>
            <CardContent className="px-6 pb-6 flex flex-wrap gap-4">
              {FONTS.map((f) => (
                <label
                  key={f.value}
                  className="inline-flex items-center space-x-2"
                >
                  <input
                    type="radio"
                    name="fontFamily"
                    checked={draft.fontFamily === f.value}
                    onChange={() => upd("fontFamily", f.value)}
                    className="form-radio h-4 w-4 text-indigo-500"
                  />
                  <span className="text-gray-800 dark:text-gray-100">
                    {f.label}
                  </span>
                </label>
              ))}
            </CardContent>
          </Card>

          {/* Тіл */}
          <Card className="rounded-lg shadow bg-white dark:bg-gray-800">
            <CardHeader className="flex flex-col items-center pt-6 pb-0">
              <Globe className="w-6 h-6 text-indigo-500" />
              <CardTitle className="mt-2 text-lg font-semibold text-gray-800 dark:text-gray-100">
                Тіл
              </CardTitle>
            </CardHeader>
            <CardContent className="px-6 pb-6">
              <Select
                value={draft.language}
                onValueChange={(v) => upd("language", v)}
              >
                <SelectTrigger className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-indigo-300">
                  <SelectValue placeholder="Тілді таңдаңыз" />
                </SelectTrigger>
                <SelectContent>
                  {LANGS.map((l) => (
                    <SelectItem key={l.value} value={l.value}>
                      {l.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Шрифт өлшемі */}
          <Card className="md:col-span-2 rounded-lg shadow bg-white dark:bg-gray-800">
            <CardHeader className="flex flex-col items-center pt-6 pb-0">
              <Text className="w-6 h-6 text-indigo-500" />
              <CardTitle className="mt-2 text-lg font-semibold text-gray-800 dark:text-gray-100">
                Шрифт өлшемі
              </CardTitle>
            </CardHeader>
            <CardContent className="px-6 pb-6">
              <input
                type="range"
                min={12}
                max={24}
                step={1}
                value={draft.fontSize}
                onChange={(e) => upd("fontSize", Number(e.target.value))}
                className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg accent-indigo-500"
              />
              <div className="mt-2 text-right font-medium text-gray-800 dark:text-gray-100">
                {draft.fontSize}px
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Кнопки Cancel / Save */}
        <div className="mt-8 flex justify-center space-x-4">
          {/* Болдырмау */}
          <Dialog open={isResetOpen} onOpenChange={setIsResetOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="px-6">
                Болдырмау
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-sm rounded-lg bg-white dark:bg-gray-800 shadow-xl">
              <DialogHeader>
                <DialogTitle className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                  Өзгерістерді болдырмау
                </DialogTitle>
                <DialogDescription className="mt-2 text-gray-600 dark:text-gray-400">
                  Сіз шынымен өзгерістерді болдырмайсыз ба?
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="mt-6 flex justify-end space-x-3">
                <DialogClose asChild>
                  <Button variant="outline" className="px-6">
                    Жоқ
                  </Button>
                </DialogClose>
                <Button
                  variant="destructive"
                  className="px-6"
                  onClick={handleReset}
                >
                  Иә
                </Button>
              </DialogFooter>
              <DialogClose className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
            </DialogContent>
          </Dialog>

          {/* Сақтау */}
          <Dialog open={isSaveOpen} onOpenChange={setIsSaveOpen}>
            <DialogTrigger asChild>
              <Button className="px-6 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg">
                Сақтау
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-sm rounded-lg bg-white dark:bg-gray-800 shadow-xl">
              <DialogHeader>
                <DialogTitle className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                  Өзгерістерді сақтау
                </DialogTitle>
                <DialogDescription className="mt-2 text-gray-600 dark:text-gray-400">
                  Сіз шынымен өзгерістерді сақтайсыз ба?
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="mt-6 flex justify-end space-x-3">
                <DialogClose asChild>
                  <Button variant="outline" className="px-6">
                    Жоқ
                  </Button>
                </DialogClose>
                {/* Красная кнопка «Иә» */}
                <Button
                  variant="destructive"
                  className="px-6"
                  onClick={handleSave}
                >
                  Иә
                </Button>
              </DialogFooter>
              <DialogClose className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}
