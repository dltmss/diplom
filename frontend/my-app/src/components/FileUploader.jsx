import React from "react";

export default function FileUploader({ onFileUpload }) {
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (event) => {
      const content = event.target.result;
      onFileUpload(content); // Передаем содержимое в родительский компонент
    };

    reader.readAsText(file); // Для CSV читаем как текст
  };

  return (
    <div className="mb-6">
      <label className="text-white block mb-2 text-lg font-semibold">
        Файлды импорттау (CSV)
      </label>
      <input
        type="file"
        accept=".csv"
        onChange={handleFileChange}
        className="bg-gray-800 text-white px-4 py-2 border border-gray-600 rounded"
      />
    </div>
  );
}
