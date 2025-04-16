import React from "react";

export default function DataTable({ data }) {
  if (!data || data.length === 0) return null;

  const headers = Object.keys(data[0]);

  return (
    <div className="overflow-auto border rounded-lg mt-4">
      <table className="min-w-full text-sm bg-white rounded">
        <thead className="bg-purple-600 text-white">
          <tr>
            {headers.map((key) => (
              <th key={key} className="p-2 text-left border">
                {key}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr key={idx} className="border-t">
              {headers.map((key) => (
                <td key={key} className="p-2 border">
                  {row[key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
