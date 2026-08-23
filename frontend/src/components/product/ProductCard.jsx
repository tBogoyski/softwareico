import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { mediaUrl } from "../../api/client";
import { useLanguage } from "../../context/LanguageContext";
import CategoryIcon from "../ui/CategoryIcon";
import PricingBadge from "../ui/PricingBadge";

/** Tag chips shown inline before collapsing the rest into a "+N" chip. */
const MAX_VISIBLE_TAGS = 3;

export default function ProductCard({ product, index = 0 }) {
  const { t } = useLanguage();

  const tags = product.tags || [];
  const visibleTags = tags.slice(0, MAX_VISIBLE_TAGS);
  const hiddenTagCount = tags.length - visibleTags.length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "50px" }}
      transition={{ duration: 0.3, delay: Math.min(index * 0.05, 0.15) }}
      whileHover={{ y: -4 }}
    >
      <Link
        to={`/products/${product.slug}`}
        className={`relative flex h-full flex-col overflow-hidden rounded-xl bg-white shadow-card transition-all hover:shadow-card-hover ${
          product.is_featured
            ? "border border-primary-300 ring-1 ring-primary-200"
            : "border border-gray-200 hover:border-primary-200"
        }`}
      >
        {/* Featured marker. Absolutely positioned so it costs no vertical
            space -- the old inline badge pushed the whole card down. */}
        {product.is_featured && (
          <span
            className="absolute right-3.5 top-3.5 inline-flex h-6 w-6 items-center justify-center rounded-full border border-primary-200 bg-primary-50 text-primary-700"
            title={t("card.featured")}
          >
            <span className="sr-only">{t("card.featured")}</span>
            <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </span>
        )}

        {/* flex-1 lets this block absorb the slack in a stretched grid cell, so
            the footer below always sits on the bottom edge and footers line up
            across a row. pb keeps a minimum gap when the card is the tallest. */}
        <div className="flex-1 pb-[18px]">
        {/* Header: small logo beside the name, rather than a 160px logo above it. */}
        <div className="flex items-start gap-3.5 px-5 pt-5">
          <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center overflow-hidden rounded-lg border border-gray-200 bg-white">
            {product.logo ? (
              <img
                src={mediaUrl(product.logo)}
                alt={`${product.name} logo`}
                loading="lazy"
                className="max-h-full max-w-full object-contain p-1.5"
              />
            ) : (
              <span className="text-2xl font-bold text-primary-600">
                {product.name.charAt(0)}
              </span>
            )}
          </div>
          {/* Right padding keeps a long name clear of the featured star. */}
          <h3 className="min-w-0 flex-1 pr-7 text-[17px] font-semibold leading-snug tracking-tight text-gray-900 line-clamp-2">
            {product.name}
          </h3>
        </div>

        {/* The list endpoint already returns tagline and tags -- the card used
            to drop both, which is what made the grid look so empty. */}
        {product.tagline && (
          <p className="mt-3 px-5 text-sm leading-relaxed text-gray-600 line-clamp-2">
            {product.tagline}
          </p>
        )}

        {visibleTags.length > 0 && (
          <div className="mt-3.5 flex flex-wrap gap-1.5 px-5">
            {visibleTags.map((tag) => (
              <span
                key={tag.id}
                className="rounded-md bg-gray-100 px-2.5 py-1 text-xs leading-tight text-gray-600"
              >
                {tag.name}
              </span>
            ))}
            {hiddenTagCount > 0 && (
              <span className="rounded-md border border-gray-200 bg-white px-2.5 py-1 text-xs leading-tight text-gray-400">
                +{hiddenTagCount}
              </span>
            )}
          </div>
        )}
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-gray-100 px-5 py-3">
          {product.category ? (
            <span className="flex min-w-0 items-center gap-1.5 text-[13px] text-gray-500">
              <CategoryIcon
                icon={product.category.icon}
                className="flex-shrink-0 text-primary-500"
              />
              <span className="truncate">{product.category.name}</span>
            </span>
          ) : (
            <span />
          )}
          <PricingBadge pricingType={product.pricing_type} size="sm" />
        </div>
      </Link>
    </motion.div>
  );
}
