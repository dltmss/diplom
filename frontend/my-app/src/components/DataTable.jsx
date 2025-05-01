import React from "react";

/**
 * DataTable component
 * @param {string[]} headers - массив заголовков
 * @param {Array<Array<string|number>>} data - двумерный массив строк
 * @param {function} rowKey - функция для генерации ключа строки
 */
export default function DataTable({ headers, data, rowKey = (row, i) => i }) {
  return (
    <div className="overflow-x-auto rounded-lg shadow bg-white">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50 sticky top-0 z-10">
          <tr>
            {headers.map((h, idx) => (
              <th
                key={idx}
                scope="col"
                className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap"
                style={{ minWidth: "100px" }}
                title={h}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {data.map((row, rIdx) => (
            <tr
              key={rowKey(row, rIdx)}
              className={
                rIdx % 2 === 0
                  ? "bg-gray-50 hover:bg-gray-100"
                  : "hover:bg-gray-100"
              }
            >
              {row.map((cell, cIdx) => (
                <td
                  key={cIdx}
                  className="px-4 py-2 whitespace-nowrap text-sm text-gray-800 truncate"
                  style={{ maxWidth: "120px" }}
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
