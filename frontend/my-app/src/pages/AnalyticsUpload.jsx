// src/pages/AnalyticsUpload.jsx
import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Papa from "papaparse";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { toast } from "react-hot-toast";
import { UploadCloud } from "lucide-react";

export default function AnalyticsUpload() {
  const navigate = useNavigate();
  const inputRef = useRef(null);

  const [dragOver, setDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [percent, setPercent] = useState(0);

  const handleCsv = async (file) => {
    setSelectedFile(file);
    setPercent(0);

    // FileReader для прогресса
    const reader = new FileReader();
    reader.onprogress = (e) => {
      if (e.total > 0) setPercent(Math.round((e.loaded / e.total) * 100));
    };
    reader.onloadend = () => setPercent(100);
    reader.readAsArrayBuffer(file);

    // Парсим только CSV
    try {
      await new Promise((res, rej) =>
        Papa.parse(file, {
          header: false,
          skipEmptyLines: true,
          complete: ({ data }) => {
            if (data.length < 2) return rej(new Error("Деректер табылмады"));
            const headers = data[0];
            const rows = data.slice(1);
            navigate("/analytics/filter", { state: { headers, data: rows } });
            res();
          },
          error: (err) => rej(err),
        })
      );
    } catch (err) {
      console.error(err);
      toast.error("CSV талдау қателігі: " + err.message);
      reset();
    }
  };

  const onFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const ext = file.name.split(".").pop().toLowerCase();
    if (ext !== "csv") {
      toast.error("Тек CSV файлдары ғана қабылданады");
      return reset();
    }
    handleCsv(file);
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (!file) return;
    const ext = file.name.split(".").pop().toLowerCase();
    if (ext !== "csv") {
      toast.error("Тек CSV файлдары ғана қабылданады");
      return;
    }
    handleCsv(file);
  };

  const reset = () => {
    setSelectedFile(null);
    setPercent(0);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-start bg-gray-100 dark:bg-gray-900 p-6 space-y-8 transition-colors">
      {/* Stepper */}
      <div className="flex items-center space-x-4">
        {["Жүктеу", "Сүзу", "Визуалдау"].map((step, i) => (
          <React.Fragment key={i}>
            <div className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                  ${
                    i === 0
                      ? "bg-blue-600 text-white"
                      : "bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-300"
                  }
                `}
              >
                {i + 1}
              </div>
              <span className="ml-2 text-gray-700 dark:text-gray-200">
                {step}
              </span>
            </div>
            {i < 2 && (
              <div className="flex-1 h-px bg-gray-300 dark:bg-gray-700" />
            )}
          </React.Fragment>
        ))}
      </div>

      <Card className="w-full max-w-xl bg-white dark:bg-gray-800 transition-colors">
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-gray-100">
            Аналитикаға CSV жүктеңіз
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
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
              border-2 border-dashed rounded-lg p-10 text-center cursor-pointer select-none
              transition-colors
              ${
                dragOver
                  ? "border-blue-600 bg-blue-50 dark:bg-gray-700/50"
                  : "border-gray-300 dark:border-gray-600 bg-transparent"
              }
            `}
          >
            <UploadCloud className="mx-auto w-12 h-12 text-blue-600" />
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              Файлды осында сүйреп әкеліңіз немесе шертіңіз
            </p>
          </div>

          <input
            ref={inputRef}
            type="file"
            accept=".csv"
            onChange={onFileChange}
            className="hidden"
          />

          {/* Preview + Progress */}
          {selectedFile && (
            <div className="border rounded-md p-4 bg-gray-50 dark:bg-gray-700 transition-colors space-y-2">
              <div className="flex justify-between text-gray-800 dark:text-gray-100">
                <span>{selectedFile.name}</span>
                <span>{(selectedFile.size / 1024).toFixed(1)} КБ</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-600 h-2 rounded">
                <div
                  className="bg-blue-600 h-2 rounded transition-all"
                  style={{ width: `${percent}%` }}
                />
              </div>
              <div className="flex gap-2 mt-2">
                <Button variant="outline" size="sm" onClick={reset}>
                  Болдырмау
                </Button>
                <Button size="sm" onClick={() => inputRef.current.click()}>
                  Өзгерту
                </Button>
              </div>
            </div>
          )}

          {/* Primary button */}
          {!selectedFile && (
            <Button
              className="w-full bg-blue-600 hover:bg-blue-700 text-white transition-colors"
              onClick={() => inputRef.current.click()}
            >
              Файлды таңдау (тек CSV)
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Инструкция */}
      <Card className="w-full max-w-xl bg-white dark:bg-gray-800 transition-colors">
        <CardContent>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Қалай жұмыс істейді?
          </h2>
          <ul className="mt-2 list-decimal list-inside text-gray-700 dark:text-gray-300 space-y-1">
            <li>Тек CSV файлын жүктеңіз</li>
            <li>Сүзгілерді баптаңыз</li>
            <li>Графикті экспорттаңыз</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
