// src/pages/AnalyticsUpload.jsx
import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Papa from "papaparse";
import * as XLSX from "xlsx";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf";
import workerUrl from "pdfjs-dist/build/pdf.worker.min.mjs?url";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { toast } from "react-hot-toast";
import { UploadCloud } from "lucide-react";

pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl;

export default function AnalyticsUpload() {
  const navigate = useNavigate();
  const inputRef = useRef(null);

  const [dragOver, setDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [percent, setPercent] = useState(0);

  const handleFile = async (file) => {
    setSelectedFile(file);
    setPercent(0);

    // Симуляция прогрессті FileReader-мен
    const reader = new FileReader();
    reader.onprogress = (e) => {
      if (e.total > 0) setPercent(Math.round((e.loaded / e.total) * 100));
    };
    reader.onloadend = () => setPercent(100);
    reader.readAsArrayBuffer(file);

    const ext = file.name.split(".").pop().toLowerCase();
    let rows = [];

    try {
      if (ext === "csv") {
        await new Promise((res) =>
          Papa.parse(file, {
            header: false,
            skipEmptyLines: true,
            complete: ({ data }) => {
              rows = data;
              res();
            },
          })
        );
      } else if (["xlsx", "xls"].includes(ext)) {
        const buf = await file.arrayBuffer();
        const wb = XLSX.read(buf, { type: "array" });
        const ws = wb.Sheets[wb.SheetNames[0]];
        rows = XLSX.utils.sheet_to_json(ws, { header: 1 });
      } else if (ext === "pdf") {
        const buf = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: buf }).promise;
        let txts = [];
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const txt = await page.getTextContent();
          txts.push(txt.items.map((it) => it.str).join(" "));
        }
        rows = txts
          .join("\n")
          .split(/\r?\n/)
          .filter(Boolean)
          .map((l) => l.split(/\s+/));
      } else {
        toast.error("Тек CSV, XLSX немесе PDF форматтары қолжетімді");
        return;
      }

      if (rows.length < 2) {
        toast.error("Деректер табылмады");
        return;
      }

      const headers = rows[0];
      const data = rows.slice(1);
      navigate("/analytics/filter", { state: { headers, data } });
    } catch (err) {
      console.error(err);
      toast.error("Жүктеу кезінде қате пайда болды");
    }
  };

  const onChange = (e) => {
    const f = e.target.files?.[0];
    if (f) handleFile(f);
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  };

  const reset = () => {
    setSelectedFile(null);
    setPercent(0);
    inputRef.current.value = "";
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-start bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-6 space-y-8">
      {/* Stepper */}
      <div className="flex space-x-4">
        {["Жүктеу", "Сүзу", "Визуалдау"].map((step, i) => (
          <div key={i} className="flex items-center">
            <div
              className={`
                w-8 h-8 rounded-full flex items-center justify-center
                ${
                  i === 0
                    ? "bg-accent text-white"
                    : "bg-gray-300 dark:bg-gray-600 text-gray-800"
                }
              `}
            >
              {i + 1}
            </div>
            <span className="ml-2 text-sm">{step}</span>
            {i < 2 && <div className="w-8 h-0.5 bg-gray-300 mx-4"></div>}
          </div>
        ))}
      </div>

      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>Аналитикаға мәлімет жүктеңіз</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Үлгі файл сілтемесі */}
          <div>
            <a
              href="/sample.csv"
              download="sample.csv"
              className="text-sm text-accent hover:underline"
            >
              Үлгі CSV/XLSX шаблонын жүктеп алу
            </a>
          </div>

          {/* Dropzone */}
          <div
            onClick={() => inputRef.current.click()}
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={onDrop}
            className={`
              dropzone border-2 border-dashed rounded-lg p-10 text-center
              transition-colors cursor-pointer
              ${
                dragOver
                  ? "border-accent bg-accent/10"
                  : "border-gray-300 dark:border-gray-600 bg-transparent"
              }
            `}
          >
            <UploadCloud className="mx-auto w-12 h-12 text-accent" />
            <p className="mt-2 text-gray-700 dark:text-gray-200">
              Файлды осында сүйреп әкелу немесе шерту
            </p>
          </div>

          <input
            ref={inputRef}
            type="file"
            accept=".csv,.xlsx,.xls,.pdf"
            onChange={onChange}
            className="hidden"
          />

          {/* Таңдалған файл preview */}
          {selectedFile && (
            <div className="border p-4 rounded-md bg-gray-50 dark:bg-gray-800 space-y-2">
              <div className="flex justify-between">
                <span>{selectedFile.name}</span>
                <span>{(selectedFile.size / 1024).toFixed(1)} КБ</span>
              </div>
              {/* Прогресс-бар */}
              <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded">
                <div
                  className="bg-accent h-2 rounded"
                  style={{ width: `${percent}%` }}
                />
              </div>
              <div className="flex gap-2 mt-2">
                <Button size="sm" variant="outline" onClick={reset}>
                  Болдырмау
                </Button>
                <Button size="sm" onClick={() => inputRef.current.click()}>
                  Өзгерту
                </Button>
              </div>
            </div>
          )}

          {/* Негізгі батырма */}
          {!selectedFile && (
            <Button onClick={() => inputRef.current.click()} className="w-full">
              Файлды таңдау
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Қалай жұмыс істейді? */}
      <div className="w-full max-w-lg bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md space-y-4">
        <h2 className="text-lg font-semibold">Қалай жұмыс істейді?</h2>
        <ul className="list-decimal list-inside space-y-1 text-gray-600 dark:text-gray-300">
          <li>CSV/XLSX немесе PDF жүктеңіз</li>
          <li>Қажетті сүзгілерді баптаңыз</li>
          <li>Графикті қарап, экспорттаңыз</li>
        </ul>
      </div>
    </div>
  );
}
