import { useState } from "react";
import { useLanguage } from "../../context/LanguageContext";
import CategoryIcon from "../ui/CategoryIcon";

export default function ProductFilter({
  filters,
  onChange,
  categories,
  tags,
}) {
  const { t } = useLanguage();
  const [mobileOpen, setMobileOpen] = useState(false);

  const PRICING_OPTIONS = [
    { value: "free", label: t("pricing.free"), color: "bg-green-500" },
    { value: "freemium", label: t("pricing.freemium"), color: "bg-blue-500" },
    { value: "paid", label: t("pricing.paid"), color: "bg-amber-500" },
    { value: "contact_for_pricing", label: t("pricing.contact_for_pricing"), color: "bg-gray-400" },
  ];

  const selectedTags = filters.tags ? filters.tags.split(",").filter(Boolean) : [];

  function toggleTag(slug) {
    const next = selectedTags.includes(slug)
      ? selectedTags.filter((s) => s !== slug)
      : [...selectedTags, slug];
    onChange("tags", next.join(","));
  }

  const activeCount =
    (filters.category ? 1 : 0) +
    (filters.pricing ? 1 : 0) +
    selectedTags.length;

  const filterContent = (
    <div className="space-y-5">
      {/* Category filter */}
      <div>
        <h3 className="flex items-center gap-2 text-xs font-semibold text-primary-600 uppercase tracking-wider mb-3">
          <i className="fas fa-folder" aria-hidden="true" />
          {t("filter.category")}
        </h3>
        <div className="space-y-0.5">
          <button
            onClick={() => onChange("category", "")}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${
              !filters.category
                ? "bg-primary-50 text-primary-700 font-medium"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            <span className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
              <i className="fas fa-border-all text-xs text-gray-400" aria-hidden="true" />
            </span>
            {t("filter.all")}
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onChange("category", cat.slug)}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${
                filters.category === cat.slug
                  ? "bg-primary-50 text-primary-700 font-medium"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <span
                className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  filters.category === cat.slug ? "bg-primary-100" : "bg-gray-100"
                }`}
              >
                <CategoryIcon
                  icon={cat.icon}
                  className={`text-xs ${
                    filters.category === cat.slug ? "text-primary-600" : "text-gray-400"
                  }`}
                />
              </span>
              <span className="text-left leading-tight">{cat.name}</span>
              <span className="text-xs text-gray-400 ml-auto flex-shrink-0">
                {cat.product_count}
              </span>
            </button>
          ))}
        </div>
      </div>

      <hr className="border-gray-100" />

      {/* Pricing filter */}
      <div>
        <h3 className="flex items-center gap-2 text-xs font-semibold text-primary-600 uppercase tracking-wider mb-3">
          <i className="fas fa-tag" aria-hidden="true" />
          {t("filter.pricing")}
        </h3>
        <div className="space-y-0.5">
          <button
            onClick={() => onChange("pricing", "")}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${
              !filters.pricing
                ? "bg-primary-50 text-primary-700 font-medium"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-gray-300 flex-shrink-0" />
            {t("filter.all")}
          </button>
          {PRICING_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => onChange("pricing", opt.value)}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${
                filters.pricing === opt.value
                  ? "bg-primary-50 text-primary-700 font-medium"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <span className={`w-2 h-2 rounded-full flex-shrink-0 ${opt.color}`} />
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <hr className="border-gray-100" />

      {/* Tags filter */}
      {tags.length > 0 && (
        <div>
          <h3 className="flex items-center gap-2 text-xs font-semibold text-primary-600 uppercase tracking-wider mb-3">
            <i className="fas fa-tags" aria-hidden="true" />
            {t("filter.tags")}
          </h3>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => {
              const active = selectedTags.includes(tag.slug);
              return (
                <button
                  key={tag.id}
                  onClick={() => toggleTag(tag.slug)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                    active
                      ? "bg-primary-600 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {tag.name}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <>
      <button
        type="button"
        onClick={() => setMobileOpen(!mobileOpen)}
        className="lg:hidden w-full flex items-center justify-center gap-2 px-4 py-2.5 mb-4 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
      >
        <i className="fas fa-sliders" aria-hidden="true" />
        {t("filter.toggle")}
        {activeCount > 0 && (
          <span className="ml-1 px-1.5 py-0.5 bg-primary-600 text-white text-xs rounded-full">
            {activeCount}
          </span>
        )}
        <i
          className={`fas fa-chevron-${mobileOpen ? "up" : "down"} ml-auto text-xs`}
          aria-hidden="true"
        />
      </button>

      {mobileOpen && (
        <div className="lg:hidden bg-white rounded-xl border border-gray-200 p-4 mb-6">
          {filterContent}
        </div>
      )}

      <aside className="hidden lg:block bg-white rounded-xl border border-gray-200 p-5 sticky top-20">
        {filterContent}
      </aside>
    </>
  );
}
