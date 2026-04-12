import { useLanguage } from "../../context/LanguageContext";

export default function Pagination({
  currentPage,
  totalCount,
  pageSize = 12,
  onPageChange,
}) {
  const { t } = useLanguage();
  const totalPages = Math.ceil(totalCount / pageSize);

  if (totalPages <= 1) return null;

  function getPages() {
    const pages = [];

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
      return pages;
    }

    pages.push(1);
    if (currentPage > 3) pages.push("...");

    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);
    for (let i = start; i <= end; i++) pages.push(i);

    if (currentPage < totalPages - 2) pages.push("...");
    pages.push(totalPages);

    return pages;
  }

  const pages = getPages();

  const btnBase =
    "px-3 py-2 text-sm font-medium rounded-lg transition-colors";
  const btnActive = "bg-primary-600 text-white";
  const btnInactive =
    "text-gray-700 bg-white border border-gray-200 hover:bg-gray-50";
  const btnDisabled =
    "text-gray-300 bg-white border border-gray-100 cursor-not-allowed";

  return (
    <nav
      className="flex items-center justify-center gap-1.5 mt-10"
      aria-label={t("pagination.label")}
    >
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`${btnBase} ${currentPage === 1 ? btnDisabled : btnInactive}`}
        aria-label={t("pagination.prev")}
      >
        <i className="fas fa-chevron-left text-xs" aria-hidden="true" />
      </button>

      {pages.map((page, i) =>
        page === "..." ? (
          <span key={`ellipsis-${i}`} className="px-2 text-gray-400">
            ...
          </span>
        ) : (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`${btnBase} ${page === currentPage ? btnActive : btnInactive}`}
            aria-current={page === currentPage ? "page" : undefined}
          >
            {page}
          </button>
        )
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`${btnBase} ${currentPage === totalPages ? btnDisabled : btnInactive}`}
        aria-label={t("pagination.next")}
      >
        <i className="fas fa-chevron-right text-xs" aria-hidden="true" />
      </button>
    </nav>
  );
}
