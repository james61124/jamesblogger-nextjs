"use client";

export default function Pagination({ currentPage, totalPages, goToPage }) {
  if (totalPages <= 1) return null;

  const buttonClass =
    "inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#746b5e]/20 bg-white/15 text-lg text-[#5e574e] transition-all hover:border-[#746b5e]/40 hover:bg-white/40 disabled:cursor-not-allowed disabled:opacity-30";

  return (
    <nav aria-label="Pagination" className="flex items-center justify-center gap-3">
      <button
        type="button"
        onClick={() => goToPage(currentPage - 1)}
        disabled={currentPage === 1}
        className={buttonClass}
        aria-label="Previous page"
      >
        ←
      </button>

      <span className="min-w-[130px] text-center font-serif text-sm italic text-[#746b5e]">
        Page {currentPage} of {totalPages}
      </span>

      <button
        type="button"
        onClick={() => goToPage(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={buttonClass}
        aria-label="Next page"
      >
        →
      </button>
    </nav>
  );
}
