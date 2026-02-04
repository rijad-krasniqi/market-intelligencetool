import { Download } from 'lucide-react';
import { generateCSV } from '../../utils/helpers';

export default function ExportButton({ data, filename = 'adintel-export', className = '' }) {
  const handleExport = () => {
    if (!data || data.length === 0) return;
    generateCSV(data, filename);
  };

  return (
    <button
      onClick={handleExport}
      disabled={!data || data.length === 0}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg bg-[#241E35] border border-[#3B3255] text-[#C4B5FD] hover:bg-[#2D2545] hover:text-[#F5F3FF] hover:border-violet-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 ${className}`}
    >
      <Download className="w-4 h-4" />
      <span>Export CSV</span>
    </button>
  );
}
