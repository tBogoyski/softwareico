import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { mediaUrl } from "../../api/client";
import { useLanguage } from "../../context/LanguageContext";
import CategoryIcon from "../ui/CategoryIcon";
import PricingBadge from "../ui/PricingBadge";

export default function ProductCard({ product, index = 0 }) {
  const { t } = useLanguage();
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
        className={`block bg-white rounded-xl shadow-sm border overflow-hidden hover:shadow-md transition-shadow h-full ${
          product.is_featured
            ? "border-primary-300 ring-1 ring-primary-200"
            : "border-gray-300"
        }`}
      >
        {/* Card body */}
        <div className="p-5 relative">
          {/* Featured badge */}
          {product.is_featured && (
            <span className="inline-flex items-center gap-1 bg-primary-50 text-primary-700 text-xs font-medium px-2 py-0.5 rounded-full border border-primary-200">
              <svg
                className="w-3 h-3"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              {t("card.featured")}
            </span>
          )}
          {/* Centered logo — fixed-size container ensures all cards match */}
          <div className={`flex justify-center mb-4 ${product.is_featured ? "mt-3" : "mt-2"}`}>
            <div className="w-40 h-40 rounded-xl border border-gray-200 bg-gray-50 flex items-center justify-center overflow-hidden">
              {product.logo ? (
                <img
                  src={mediaUrl(product.logo)}
                  alt={`${product.name} logo`}
                  loading="lazy"
                  className="max-w-full max-h-full object-contain p-2"
                />
              ) : (
                <span className="text-primary-600 font-bold text-5xl">
                  {product.name.charAt(0)}
                </span>
              )}
            </div>
          </div>

          {/* Name */}
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 text-center">
            {product.name}
          </h3>

          {/* Category + Pricing badge */}
          <div className="mt-3 flex items-center justify-center gap-3">
            {product.category && (
              <div className="flex items-center gap-1.5 text-sm text-gray-500">
                <CategoryIcon
                  icon={product.category.icon}
                  className="text-primary-500"
                />
                <span>{product.category.name}</span>
              </div>
            )}
            <PricingBadge pricingType={product.pricing_type} />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
