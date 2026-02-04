import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  const pages = [];
  const maxVisiblePages = 5;

  // Calculate page range
  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
  let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2 mt-6">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 rounded-lg bg-[#241E35] border border-[#3B3255] text-[#C4B5FD] hover:bg-[#2D2545] hover:text-[#F5F3FF] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      {startPage > 1 && (
        <>
          <button
            onClick={() => onPageChange(1)}
            className="w-10 h-10 rounded-lg bg-[#241E35] border border-[#3B3255] text-[#C4B5FD] hover:bg-[#2D2545] hover:text-[#F5F3FF] transition-all duration-200"
          >
            1
          </button>
          {startPage > 2 && (
            <span className="text-[#8B7FB5] px-2">...</span>
          )}
        </>
      )}

      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`w-10 h-10 rounded-lg border transition-all duration-200 ${
            page === currentPage
              ? 'bg-violet-600 border-violet-600 text-white'
              : 'bg-[#241E35] border-[#3B3255] text-[#C4B5FD] hover:bg-[#2D2545] hover:text-[#F5F3FF]'
          }`}
        >
          {page}
        </button>
      ))}

      {endPage < totalPages && (
        <>
          {endPage < totalPages - 1 && (
            <span className="text-[#8B7FB5] px-2">...</span>
          )}
          <button
            onClick={() => onPageChange(totalPages)}
            className="w-10 h-10 rounded-lg bg-[#241E35] border border-[#3B3255] text-[#C4B5FD] hover:bg-[#2D2545] hover:text-[#F5F3FF] transition-all duration-200"
          >
            {totalPages}
          </button>
        </>
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-2 rounded-lg bg-[#241E35] border border-[#3B3255] text-[#C4B5FD] hover:bg-[#2D2545] hover:text-[#F5F3FF] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      <span className="ml-4 text-sm text-[#8B7FB5]">
        Page {currentPage} of {totalPages}
      </span>
    </div>
  );
}
