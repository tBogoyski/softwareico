import { Link } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";
import useFeaturedProducts from "../../hooks/useFeaturedProducts";
import ProductCard from "./ProductCard";

export default function FeaturedProducts() {
  const { t } = useLanguage();
  const { data: products, loading } = useFeaturedProducts();

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
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
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <p className="text-center text-gray-500 py-8">{t("featured.empty")}</p>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product, i) => (
          <ProductCard key={product.id} product={product} index={i} />
        ))}
      </div>
      <div className="mt-8 text-center">
        <Link
          to="/products"
          className="text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors"
        >
          <i className="fas fa-list mr-1.5 text-xs" aria-hidden="true" />
          {t("featured.viewAll")} &rarr;
        </Link>
      </div>
    </>
  );
}
