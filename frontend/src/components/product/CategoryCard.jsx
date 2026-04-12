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
        className="block bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-center hover:shadow-md transition-shadow h-full"
      >
        <div className="w-14 h-14 mx-auto rounded-full bg-primary-50 flex items-center justify-center">
          <CategoryIcon
            icon={category.icon}
            className="text-2xl text-primary-600"
          />
        </div>
        <h3 className="mt-4 text-base font-semibold text-gray-900">
          {category.name}
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          {category.product_count}{" "}
          {category.product_count === 1
            ? t("category.productSingular")
            : t("category.productPlural")}
        </p>
      </Link>
    </motion.div>
  );
}
