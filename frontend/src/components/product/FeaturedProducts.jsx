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
