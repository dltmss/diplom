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
import { Clock, Type, Text } from "lucide-react";
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
  const { settings, setSettings } = useSettings();
  const [draft, setDraft] = useState(settings);

  useEffect(() => {
    setDraft(settings);
  }, [settings]);

  const [isSaveOpen, setIsSaveOpen] = useState(false);
  const [isResetOpen, setIsResetOpen] = useState(false);

  const TIMEOUTS = [5, 15, 30, 60];
  const TIME_FORMATS = [
    { value: "12", label: "12 сағаттық" },
    { value: "24", label: "24 сағаттық" },
  ];
  const FONTS = [
    { value: "sans-serif", label: "Sans-serif" },
    { value: "serif", label: "Serif" },
    { value: "monospace", label: "Monospace" },
  ];

  const upd = (key, val) => setDraft((d) => ({ ...d, [key]: val }));

  const handleReset = () => {
    setDraft(settings);
    setIsResetOpen(false);
  };

  const handleSave = () => {
    setSettings(draft);
    localStorage.setItem("settings", JSON.stringify(draft));
    setIsSaveOpen(false);
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900 pt-4 px-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Авто-шығу */}
          <Card>
            <CardHeader className="flex flex-col items-center pt-6 pb-0">
              <Clock className="w-6 h-6 text-indigo-500" />
              <CardTitle className="mt-2">Авто-шығу (минут)</CardTitle>
            </CardHeader>
            <CardContent className="px-6 pb-6">
              <Select
                value={String(draft.idleTimeout)}
                onValueChange={(v) => upd("idleTimeout", Number(v))}
              >
                <SelectTrigger className="w-full">
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
          <Card>
            <CardHeader className="flex flex-col items-center pt-6 pb-0">
              <Clock className="w-6 h-6 text-indigo-500" />
              <CardTitle className="mt-2">Уақыт форматы</CardTitle>
            </CardHeader>
            <CardContent className="px-6 pb-6">
              <Select
                value={draft.timeFormat}
                onValueChange={(v) => upd("timeFormat", v)}
              >
                <SelectTrigger className="w-full">
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
          <Card>
            <CardHeader className="flex flex-col items-center pt-6 pb-0">
              <Type className="w-6 h-6 text-indigo-500" />
              <CardTitle className="mt-2">Шрифт</CardTitle>
            </CardHeader>
            <CardContent className="px-6 pb-6 flex space-x-6">
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
                  />
                  <span>{f.label}</span>
                </label>
              ))}
            </CardContent>
          </Card>

          {/* Шрифт өлшемі */}
          <Card>
            <CardHeader className="flex flex-col items-center pt-6 pb-0">
              <Text className="w-6 h-6 text-indigo-500" />
              <CardTitle className="mt-2">Шрифт өлшемі</CardTitle>
            </CardHeader>
            <CardContent className="px-6 pb-6">
              <div className="flex justify-between mb-2">
                <span>{draft.fontSize}px</span>
              </div>
              <input
                type="range"
                min={12}
                max={24}
                step={1}
                value={draft.fontSize}
                onChange={(e) => upd("fontSize", Number(e.target.value))}
                className="w-full"
              />
            </CardContent>
          </Card>
        </div>

        {/* Кнопки */}
        <div className="flex justify-center space-x-4">
          {/* Болдырмау */}
          <Dialog open={isResetOpen} onOpenChange={setIsResetOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">Болдырмау</Button>
            </DialogTrigger>
            <DialogContent className="max-w-sm">
              <DialogHeader>
                <DialogTitle>Өзгерістерді болдырмау</DialogTitle>
                <DialogDescription>
                  Сіз шынымен өзгерістерді болдырмайсыз ба?
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="flex justify-end space-x-2">
                <DialogClose asChild>
                  <Button variant="outline">Жоқ</Button>
                </DialogClose>
                {/* «Иә» красная */}
                <Button variant="destructive" onClick={handleReset}>
                  Иә
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Сақтау */}
          <Dialog open={isSaveOpen} onOpenChange={setIsSaveOpen}>
            <DialogTrigger asChild>
              <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
                Сақтау
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-sm">
              <DialogHeader>
                <DialogTitle>Өзгерістерді сақтау</DialogTitle>
                <DialogDescription>
                  Сіз шынымен өзгерістерді сақтайсыз ба?
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="flex justify-end space-x-2">
                <DialogClose asChild>
                  <Button variant="outline">Жоқ</Button>
                </DialogClose>
                {/* «Иә» красная */}
                <Button variant="destructive" onClick={handleSave}>
                  Иә
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}
