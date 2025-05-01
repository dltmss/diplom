// src/pages/Settings.jsx
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

export default function Settings({ settings, setSettings }) {
  const LANGS = [
    { value: "kz", label: "Қазақша" },
    { value: "ru", label: "Русский" },
    { value: "en", label: "English" },
  ];
  const FONTS = [
    { value: "sans-serif", label: "Sans-serif" },
    { value: "serif", label: "Serif" },
    { value: "monospace", label: "Monospace" },
  ];
  const TIMEOUTS = [5, 15, 30, 60];

  const upd = (k, v) => setSettings((s) => ({ ...s, [k]: v }));

  return (
    <div className="p-8 space-y-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
        Баптаулар / Настройки
      </h1>

      <Card>
        <CardHeader>
          <CardTitle>Auto-logout (минуты)</CardTitle>
        </CardHeader>
        <CardContent>
          <Select
            value={String(settings.idleTimeout)}
            onValueChange={(v) => upd("idleTimeout", Number(v))}
          >
            <SelectTrigger className="w-32">
              <SelectValue placeholder={`${settings.idleTimeout} мин`} />
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

      <Card>
        <CardHeader>
          <CardTitle>Font Family</CardTitle>
        </CardHeader>
        <CardContent className="flex gap-6">
          {FONTS.map((f) => (
            <label key={f.value} className="inline-flex items-center space-x-2">
              <input
                type="radio"
                name="fontFamily"
                checked={settings.fontFamily === f.value}
                onChange={() => upd("fontFamily", f.value)}
                className="form-radio"
              />
              <span className="text-gray-800 dark:text-gray-200">
                {f.label}
              </span>
            </label>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Language</CardTitle>
        </CardHeader>
        <CardContent>
          <Select
            value={settings.language}
            onValueChange={(v) => upd("language", v)}
          >
            <SelectTrigger className="w-32">
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

      <Card>
        <CardHeader>
          <CardTitle>Font Size</CardTitle>
        </CardHeader>
        <CardContent>
          <input
            type="range"
            min={12}
            max={24}
            step={1}
            value={settings.fontSize}
            onChange={(e) => upd("fontSize", Number(e.target.value))}
            className="w-full"
          />
          <div className="mt-2 text-gray-800 dark:text-gray-200">
            {settings.fontSize}px
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>High Contrast</CardTitle>
        </CardHeader>
        <CardContent>
          <label className="inline-flex items-center space-x-2">
            <input
              type="checkbox"
              checked={settings.highContrast}
              onChange={(e) => upd("highContrast", e.target.checked)}
              className="form-checkbox"
            />
            <span className="text-gray-800 dark:text-gray-200">
              Қосу / Включить
            </span>
          </label>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notify on Large Report</CardTitle>
        </CardHeader>
        <CardContent>
          <label className="inline-flex items-center space-x-2">
            <input
              type="checkbox"
              checked={settings.notifyLarge}
              onChange={(e) => upd("notifyLarge", e.target.checked)}
              className="form-checkbox"
            />
            <span className="text-gray-800 dark:text-gray-200">
              Қосу / Включить
            </span>
          </label>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Theme</CardTitle>
        </CardHeader>
        <CardContent className="flex gap-6">
          {["light", "dark"].map((t) => (
            <label key={t} className="inline-flex items-center space-x-2">
              <input
                type="radio"
                name="theme"
                checked={settings.theme === t}
                onChange={() => upd("theme", t)}
                className="form-radio"
              />
              <span className="text-gray-800 dark:text-gray-200">
                {t === "light" ? "Light / Ақ" : "Dark / Қара"}
              </span>
            </label>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Accent Color</CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            type="color"
            value={settings.accentColor}
            onChange={(e) => upd("accentColor", e.target.value)}
            className="w-12 h-8 p-0"
          />
        </CardContent>
      </Card>

      <div className="pt-4">
        <Button size="lg" onClick={() => toast.success("Сақталды!")}>
          Сақтау / Сохранить
        </Button>
      </div>
    </div>
  );
}
