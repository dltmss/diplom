// src/components/ui/DataTable.jsx
import React from "react";

export default function DataTable({ headers, data }) {
  return (
    <div className="overflow-x-auto rounded-lg shadow bg-white dark:bg-gray-800">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-700 sticky top-0 z-10">
          <tr>
            {headers.map((h, i) => (
              <th
                key={i}
                className="px-4 py-2 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase whitespace-nowrap"
                style={{ minWidth: 120 }}
                title={h}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-100 dark:divide-gray-700">
          {data.map((row, ri) => (
            <tr
              key={ri}
              className={
                ri % 2 === 0
                  ? "bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800"
                  : "hover:bg-gray-100 dark:hover:bg-gray-800"
              }
            >
              {row.map((cell, ci) => (
                <td
                  key={ci}
                  className="px-4 py-2 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200 truncate"
                  style={{ maxWidth: 120 }}
                  title={String(cell)}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
