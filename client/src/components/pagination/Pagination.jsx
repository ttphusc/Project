import React from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const getPageNumbers = () => {
    const delta = 1;
    const range = [];
    const rangeWithDots = [];

    rangeWithDots.push(1);

    let from = Math.max(2, currentPage - delta);
    let to = Math.min(totalPages - 1, currentPage + delta);

    if (from > 2) {
      rangeWithDots.push("...");
    }

    for (let i = from; i <= to; i++) {
      rangeWithDots.push(i);
    }

    if (to < totalPages - 1) {
      rangeWithDots.push("...");
    }

    if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2 my-4">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`p-2 rounded-full ${
          currentPage === 1
            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
            : "text-[#6374AE] hover:bg-[#6374AE] hover:text-white transition-colors"
        }`}
      >
        <FaChevronLeft size={16} />
      </button>

      {getPageNumbers().map((pageNumber, index) => (
        <button
          key={index}
          onClick={() => {
            if (typeof pageNumber === "number") {
              onPageChange(pageNumber);
            }
          }}
          disabled={pageNumber === "..."}
          className={`px-4 py-2 rounded-lg min-w-[40px] transition-all ${
            currentPage === pageNumber
              ? "bg-[#6374AE] text-white font-semibold"
              : pageNumber === "..."
              ? "cursor-default text-gray-500 bg-transparent hover:bg-transparent"
              : "bg-[#F2F7FB] text-[#6374AE] hover:bg-[#6374AE] hover:text-white font-semibold"
          }`}
        >
          {pageNumber}
        </button>
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`p-2 rounded-full ${
          currentPage === totalPages
            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
            : "text-[#6374AE] hover:bg-[#6374AE] hover:text-white transition-colors"
        }`}
      >
        <FaChevronRight size={16} />
      </button>
    </div>
  );
};

export default Pagination;
