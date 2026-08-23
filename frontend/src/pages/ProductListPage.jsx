import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { useLanguage } from "../context/LanguageContext";
import Container from "../components/layout/Container";
import PageBand from "../components/layout/PageBand";
import Seo from "../components/ui/Seo";
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

  // Active filters, rendered as removable chips in the header band. Each chip
  // clears just its own filter; `clearAllFilters` clears the lot.
  const selectedTagSlugs = filters.tags
    ? filters.tags.split(",").filter(Boolean)
    : [];

  const activeChips = [];

  if (filters.search) {
    activeChips.push({
      key: `search-${filters.search}`,
      label: `\u201c${filters.search}\u201d`,
      onRemove: () => handleFilterChange("search", ""),
    });
  }

  if (filters.category) {
    const cat = categories.find((c) => c.slug === filters.category);
    activeChips.push({
      key: `category-${filters.category}`,
      label: cat ? cat.name : filters.category,
      onRemove: () => handleFilterChange("category", ""),
    });
  }

  if (filters.pricing) {
    activeChips.push({
      key: `pricing-${filters.pricing}`,
      label: t(`pricing.${filters.pricing}`) || filters.pricing,
      onRemove: () => handleFilterChange("pricing", ""),
    });
  }

  for (const slug of selectedTagSlugs) {
    const tag = tags.find((x) => x.slug === slug);
    activeChips.push({
      key: `tag-${slug}`,
      label: tag ? tag.name : slug,
      onRemove: () =>
        handleFilterChange(
          "tags",
          selectedTagSlugs.filter((s) => s !== slug).join(",")
        ),
    });
  }

  return (
    <>
      <Seo
        title={t("seo.productsTitle")}
        description={t("seo.productsDesc")}
        canonical="/products"
      />

      {/* Page header band. The result count and the active filters now live
          inside it, so the band carries information instead of just colour. */}
      <PageBand>
        <motion.h1
          className="text-2xl sm:text-3xl font-bold tracking-tight"
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

        <div className="mt-5 flex flex-wrap items-center gap-2">
          <span className="text-sm text-primary-100 mr-1">
            {loading ? (
              <span className="inline-flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/70 border-t-transparent rounded-full animate-spin" />
                {t("list.loading")}
              </span>
            ) : (
              <>
                <span className="font-bold text-white">{count}</span>{" "}
                {count === 1 ? t("list.productSingular") : t("list.productPlural")}
              </>
            )}
          </span>

          {activeChips.map((chip) => (
            <button
              key={chip.key}
              onClick={chip.onRemove}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 border border-white/20 text-white text-xs font-medium hover:bg-white/20 transition-colors"
            >
              {chip.label}
              <i className="fas fa-xmark text-[10px] text-white/70" aria-hidden="true" />
            </button>
          ))}

          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="ml-1 text-[13px] font-medium text-white/75 underline underline-offset-4 hover:text-white transition-colors"
            >
              {t("list.clearFilters")}
            </button>
          )}
        </div>
      </PageBand>

      {/* Sort toolbar. The count moved up into the band, so this row holds
          only the sort control. */}
      <section className="bg-white border-b border-gray-200 sticky top-16 z-40">
        <Container>
          <div className="flex items-center justify-end py-3 gap-2">
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
            className="bg-white rounded-xl shadow-card border border-gray-200 animate-pulse"
            >
            <div className="flex items-start gap-3.5 px-5 pt-5">
            <div className="w-14 h-14 rounded-lg bg-gray-200 flex-shrink-0" />
            <div className="flex-1 pt-1.5">
            <div className="h-4 bg-gray-200 rounded w-3/4" />
            </div>
            </div>
            <div className="mt-3 px-5 space-y-2">
            <div className="h-3.5 bg-gray-200 rounded w-full" />
            <div className="h-3.5 bg-gray-200 rounded w-2/3" />
            </div>
            <div className="mt-3.5 px-5 flex gap-1.5">
            <div className="h-6 w-20 rounded-md bg-gray-200" />
            <div className="h-6 w-16 rounded-md bg-gray-200" />
            </div>
            <div className="mt-[18px] flex items-center justify-between border-t border-gray-100 px-5 py-3">
            <div className="h-4 w-24 rounded bg-gray-200" />
            <div className="h-6 w-20 rounded-full bg-gray-200" />
            </div>
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
