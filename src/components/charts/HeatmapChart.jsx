import { useMemo } from 'react';

export default function HeatmapChart({ data, rows, columns, valueKey = 'value' }) {
  // Calculate min/max for color scaling
  const { minValue, maxValue } = useMemo(() => {
    let min = Infinity;
    let max = -Infinity;

    data.forEach((item) => {
      const val = item[valueKey] || 0;
      if (val < min) min = val;
      if (val > max) max = val;
    });

    return { minValue: min, maxValue: max };
  }, [data, valueKey]);

  // Get cell value
  const getCellValue = (row, col) => {
    const item = data.find((d) => d.row === row && d.col === col);
    return item ? item[valueKey] : 0;
  };

  // Get cell color based on value
  const getCellColor = (value) => {
    if (value === 0) return 'bg-[#241E35]';

    const range = maxValue - minValue || 1;
    const normalized = (value - minValue) / range;

    if (normalized < 0.2) return 'bg-violet-900/40';
    if (normalized < 0.4) return 'bg-violet-800/50';
    if (normalized < 0.6) return 'bg-violet-700/60';
    if (normalized < 0.8) return 'bg-violet-600/70';
    return 'bg-violet-500/80';
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="p-2 text-xs text-[#8B7FB5] text-left sticky left-0 bg-[#1A1425]" />
            {columns.map((col) => (
              <th
                key={col}
                className="p-2 text-xs text-[#8B7FB5] text-center whitespace-nowrap"
              >
                {col.length > 10 ? col.substring(0, 10) + '...' : col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row}>
              <td className="p-2 text-xs text-[#C4B5FD] whitespace-nowrap sticky left-0 bg-[#1A1425]">
                {row.length > 20 ? row.substring(0, 20) + '...' : row}
              </td>
              {columns.map((col) => {
                const value = getCellValue(row, col);
                return (
                  <td key={col} className="p-1">
                    <div
                      className={`w-full h-8 rounded flex items-center justify-center text-xs ${getCellColor(
                        value
                      )} ${value > 0 ? 'text-white' : 'text-[#8B7FB5]'}`}
                      title={`${row} × ${col}: ${value}`}
                    >
                      {value > 0 ? value : ''}
                    </div>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Legend */}
      <div className="flex items-center justify-end gap-2 mt-4 text-xs text-[#8B7FB5]">
        <span>Low</span>
        <div className="flex gap-1">
          <div className="w-4 h-4 rounded bg-violet-900/40" />
          <div className="w-4 h-4 rounded bg-violet-800/50" />
          <div className="w-4 h-4 rounded bg-violet-700/60" />
          <div className="w-4 h-4 rounded bg-violet-600/70" />
          <div className="w-4 h-4 rounded bg-violet-500/80" />
        </div>
        <span>High</span>
      </div>
    </div>
  );
}
