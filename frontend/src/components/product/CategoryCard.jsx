import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useLanguage } from "../../context/LanguageContext";
import CategoryIcon from "../ui/CategoryIcon";

export default function CategoryCard({ category, index = 0 }) {
  const { t } = useLanguage();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      whileHover={{ y: -4 }}
    >
      <Link
        to={`/products?category=${category.slug}`}
        className="group block h-full rounded-xl border border-gray-200 bg-white p-6 text-center shadow-card transition-all hover:border-primary-200 hover:shadow-card-hover"
      >
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-primary-50 to-primary-100/60 transition-colors group-hover:from-primary-100 group-hover:to-primary-200/60">
          <CategoryIcon
            icon={category.icon}
            className="text-2xl text-primary-600"
          />
        </div>
        <h3 className="mt-4 text-base font-semibold text-gray-900">
          {category.name}
        </h3>
        <span className="mt-2.5 inline-block rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600 transition-colors group-hover:bg-primary-50 group-hover:text-primary-700">
          {category.product_count}{" "}
          {category.product_count === 1
            ? t("category.productSingular")
            : t("category.productPlural")}
        </span>
      </Link>
    </motion.div>
  );
}
