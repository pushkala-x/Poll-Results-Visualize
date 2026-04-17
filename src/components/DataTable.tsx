import React from 'react';
import { PollResponse } from '../types';
import { format, parseISO } from 'date-fns';

interface DataTableProps {
  data: PollResponse[];
}

export const DataTable: React.FC<DataTableProps> = ({ data }) => {
  return (
    <div className="w-full overflow-x-auto border border-line bg-white">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-line">
            <th className="px-4 py-3 col-label">ID</th>
            <th className="px-4 py-3 col-label">Timestamp</th>
            <th className="px-4 py-3 col-label">Age</th>
            <th className="px-4 py-3 col-label">Region</th>
            <th className="px-4 py-3 col-label">Tool</th>
            <th className="px-4 py-3 col-label text-right">Rating</th>
            <th className="px-4 py-3 col-label">Feedback</th>
          </tr>
        </thead>
        <tbody>
          {data.slice(0, 50).map((row) => (
            <tr 
              key={row.id} 
              className="border-b border-line hover:bg-ink hover:text-white transition-colors cursor-pointer group"
            >
              <td className="px-4 py-3 mono-value text-xs">{String(row.id).padStart(4, '0')}</td>
              <td className="px-4 py-3 mono-value text-[10px] opacity-70 group-hover:opacity-100">
                {format(parseISO(row.timestamp), 'yyyy-MM-dd HH:mm')}
              </td>
              <td className="px-4 py-3 text-xs">{row.ageGroup}</td>
              <td className="px-4 py-3 text-xs">{row.region}</td>
              <td className="px-4 py-3">
                <span className="px-2 py-0.5 bg-ink text-white text-[10px] mono-value group-hover:bg-white group-hover:text-ink">
                  {row.preferredTool}
                </span>
              </td>
              <td className="px-4 py-3 mono-value text-xs text-right font-bold">{row.satisfaction}.0</td>
              <td className="px-4 py-3 text-xs italic opacity-80 group-hover:opacity-100 truncate max-w-[200px]">
                "{row.feedback}"
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {data.length > 50 && (
        <div className="p-4 text-center border-t border-line bg-bg/50">
          <span className="col-label">Showing top 50 rows of {data.length} total</span>
        </div>
      )}
    </div>
  );
};
