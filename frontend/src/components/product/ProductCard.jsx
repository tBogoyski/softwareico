import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { mediaUrl } from "../../api/client";
import CategoryIcon from "../ui/CategoryIcon";
import PricingBadge from "../ui/PricingBadge";

export default function ProductCard({ product, index = 0 }) {
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
        className="block bg-white rounded-xl shadow-sm border border-gray-300 overflow-hidden hover:shadow-md transition-shadow h-full"
      >
        {/* Card body */}
        <div className="p-5">
          {/* Logo + pricing badge row */}
          <div className="flex items-start justify-between gap-3">
            {product.logo ? (
              <img
                src={mediaUrl(product.logo)}
                alt={`${product.name} logo`}
                loading="lazy"
                className="w-16 h-16 rounded-lg object-contain bg-gray-50 border border-gray-200 flex-shrink-0 p-1"
              />
            ) : (
              <div className="w-16 h-16 rounded-lg bg-primary-100 flex items-center justify-center flex-shrink-0">
                <span className="text-primary-600 font-bold text-lg">
                  {product.name.charAt(0)}
                </span>
              </div>
            )}
            <PricingBadge pricingType={product.pricing_type} />
          </div>

          {/* Name and tagline */}
          <h3 className="mt-4 text-lg font-semibold text-gray-900 line-clamp-1">
            {product.name}
          </h3>
          {product.tagline && (
            <p className="mt-1 text-sm text-gray-600 line-clamp-2">
              {product.tagline}
            </p>
          )}

          {/* Category */}
          {product.category && (
            <div className="mt-4 flex items-center gap-1.5 text-xs text-gray-500">
              <CategoryIcon
                icon={product.category.icon}
                className="text-primary-500"
              />
              <span>{product.category.name}</span>
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  );
}
