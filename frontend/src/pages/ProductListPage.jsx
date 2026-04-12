import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { useLanguage } from "../context/LanguageContext";
import Container from "../components/layout/Container";
import ProductCard from "../components/product/ProductCard";
import ProductFilter from "../components/product/ProductFilter";
import Pagination from "../components/ui/Pagination";
import useProducts from "../hooks/useProducts";
import useCategories from "../hooks/useCategories";
import useTags from "../hooks/useTags";

const FILTER_KEYS = ["search", "category", "tags", "pricing", "ordering", "page"];

export default function ProductListPage() {
  const { t } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();

  const filters = {};
  for (const key of FILTER_KEYS) {
    filters[key] = searchParams.get(key) || "";
  }

  const currentPage = parseInt(filters.page, 10) || 1;
  const apiParams = { ...filters, page: currentPage };

  const { data: products, count, loading } = useProducts(apiParams);
  const { data: categories } = useCategories();
  const { data: tags } = useTags();

  function handleFilterChange(key, value) {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (value) {
        next.set(key, value);
      } else {
        next.delete(key);
      }
      if (key !== "page") {
        next.delete("page");
      }
      return next;
    });
  }

  function handlePageChange(page) {
    handleFilterChange("page", page > 1 ? String(page) : "");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const hasActiveFilters = FILTER_KEYS.some(
    (key) => key !== "page" && filters[key]
  );

  function clearAllFilters() {
    setSearchParams({});
  }

  // Debounced search input
  const [searchInput, setSearchInput] = useState(filters.search || "");
  const debounceRef = useRef(null);

  useEffect(() => {
    setSearchInput(filters.search || "");
  }, [filters.search]);

  function handleSearchChange(e) {
    const value = e.target.value;
    setSearchInput(value);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      handleFilterChange("search", value);
    }, 300);
  }

  function handleSearchSubmit(e) {
    e.preventDefault();
    clearTimeout(debounceRef.current);
    handleFilterChange("search", searchInput);
  }

  const SORT_OPTIONS = [
    { value: "", label: t("list.sortDefault") },
    { value: "name", label: t("list.sortNameAsc") },
    { value: "-name", label: t("list.sortNameDesc") },
    { value: "-created_at", label: t("list.sortNewest") },
    { value: "created_at", label: t("list.sortOldest") },
  ];

  return (
    <>
      {/* Colorful page header with embedded search */}
      <section className="bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white">
        <Container className="py-10 sm:py-14">
          <motion.h1
            className="text-2xl sm:text-3xl font-bold"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {t("list.title")}
          </motion.h1>
          <motion.p
            className="mt-2 text-primary-100"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.05 }}
          >
            {t("list.subtitle")}
          </motion.p>

          <motion.form
            onSubmit={handleSearchSubmit}
            className="mt-6 flex items-center max-w-2xl"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <div className="relative flex-1">
              <i
                className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                aria-hidden="true"
              />
              <input
                type="text"
                value={searchInput}
                onChange={handleSearchChange}
                placeholder={t("index.searchPlaceholder")}
                className="w-full pl-11 pr-4 py-3 rounded-l-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent-400 text-sm"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 bg-accent-500 hover:bg-accent-600 text-white font-semibold rounded-r-xl transition-colors text-sm"
            >
              <i className="fas fa-search mr-1.5" aria-hidden="true" />
              {t("index.search")}
            </button>
          </motion.form>
        </Container>
      </section>

      {/* Sort toolbar + results count */}
      <section className="bg-white border-b border-gray-200 sticky top-16 z-40">
        <Container>
          <div className="flex items-center justify-between py-3 gap-4">
            <p className="text-sm text-gray-600 flex-shrink-0">
              {loading ? (
                <span className="inline-flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" />
                  {t("list.loading")}
                </span>
              ) : (
                <>
                  <span className="font-semibold text-gray-900">{count}</span>{" "}
                  {count === 1 ? t("list.productSingular") : t("list.productPlural")}
                  {hasActiveFilters && (
                    <button
                      onClick={clearAllFilters}
                      className="ml-3 text-primary-600 hover:text-primary-700 font-medium transition-colors"
                    >
                      <i className="fas fa-xmark mr-1" aria-hidden="true" />
                      {t("list.clearFilters")}
                    </button>
                  )}
                </>
              )}
            </p>

            <div className="flex items-center gap-2 flex-shrink-0">
              <label
                htmlFor="sort-select"
                className="text-sm text-gray-500 hidden sm:block"
              >
                {t("list.sortLabel")}
              </label>
              <select
                id="sort-select"
                value={filters.ordering || ""}
                onChange={(e) => handleFilterChange("ordering", e.target.value)}
                className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </Container>
      </section>

      {/* Main content: sidebar + grid */}
      <section className="py-8">
        <Container>
          <div className="lg:grid lg:grid-cols-[260px_1fr] lg:gap-8">
            <div>
              <ProductFilter
                filters={filters}
                onChange={handleFilterChange}
                categories={categories}
                tags={tags}
              />
            </div>

            <div>
              {loading && (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <div
                      key={i}
                      className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 animate-pulse"
                    >
                      <div className="flex items-start justify-between">
                        <div className="w-12 h-12 rounded-lg bg-gray-200" />
                        <div className="w-16 h-5 rounded-full bg-gray-200" />
                      </div>
                      <div className="mt-4 h-5 bg-gray-200 rounded w-3/4" />
                      <div className="mt-2 h-4 bg-gray-200 rounded w-full" />
                      <div className="mt-1 h-4 bg-gray-200 rounded w-2/3" />
                      <div className="mt-4 h-3 bg-gray-200 rounded w-1/3" />
                    </div>
                  ))}
                </div>
              )}

              {!loading && products.length > 0 && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {products.map((product, i) => (
                      <ProductCard key={product.id} product={product} index={i} />
                    ))}
                  </div>
                  <Pagination
                    currentPage={currentPage}
                    totalCount={count}
                    onPageChange={handlePageChange}
                  />
                </>
              )}

              {!loading && products.length === 0 && (
                <div className="text-center py-16">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary-50 flex items-center justify-center">
                    <i className="fas fa-search text-2xl text-primary-300" aria-hidden="true" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {t("list.emptyTitle")}
                  </h3>
                  <p className="mt-2 text-sm text-gray-600 max-w-sm mx-auto">
                    {t("list.emptyText")}
                  </p>
                  {hasActiveFilters && (
                    <button
                      onClick={clearAllFilters}
                      className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors"
                    >
                      <i className="fas fa-xmark" aria-hidden="true" />
                      {t("list.clearAll")}
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
