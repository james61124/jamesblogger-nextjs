import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { Button } from "./ui/button";

const Pagination = ({ currentPage, totalPages, goToPage }) => {
  const getPageNumbers = () => {
    // 如果頁數小於等於 5，就直接顯示所有頁碼
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    // 當前頁碼小於等於 3
    if (currentPage <= 3) {
      return [1, 2, 3, "...", totalPages];
    }

    // 當前頁碼接近最後頁面
    if (currentPage >= totalPages - 2) {
      return [1, "...", totalPages - 2, totalPages - 1, totalPages];
    }

    // 頁碼顯示為：1, ..., 當前頁碼前一頁, 當前頁碼, 當前頁碼後一頁, ..., 最後一頁
    return [1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages];
  };

  return (
    <div className="flex justify-center mt-16 space-x-1">
      {/* 跳到第一頁 */}
      <Button
        onClick={() => goToPage(1)}
        disabled={currentPage === 1}
        className="px-3 py-2 border border-gray-400 text-gray-600 hover:bg-gray-600 hover:text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ChevronsLeft size={20} />
      </Button>

      {/* 上一頁 */}
      <Button
        onClick={() => goToPage(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-2 border border-gray-400 text-gray-600 hover:bg-gray-600 hover:text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ChevronLeft size={20} />
      </Button>

      {/* 頁碼 */}
      {getPageNumbers().map((page, index) =>
        page === "..." ? (
          <span key={index} className="px-3 py-2 text-gray-500">
            ...
          </span>
        ) : (
          <Button
            key={page}
            onClick={() => goToPage(page)}
            className={`px-3 py-2 border border-gray-400 text-gray-600 hover:bg-gray-600 hover:text-white transition-all duration-300 ${
              currentPage === page ? "bg-gray-600 text-white" : "bg-white"
            }`}
          >
            {page}
          </Button>
        )
      )}

      {/* 下一頁 */}
      <Button
        onClick={() => goToPage(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-2 border border-gray-400 text-gray-600 hover:bg-gray-600 hover:text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ChevronRight size={20} />
      </Button>

      {/* 跳到最後一頁 */}
      <Button
        onClick={() => goToPage(totalPages)}
        disabled={currentPage === totalPages}
        className="px-3 py-2 border border-gray-400 text-gray-600 hover:bg-gray-600 hover:text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ChevronsRight size={20} />
      </Button>
    </div>
  );
};

export default Pagination;
