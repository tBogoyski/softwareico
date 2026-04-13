import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useLanguage } from "../context/LanguageContext";
import Container from "../components/layout/Container";
import Seo from "../components/ui/Seo";
import Button from "../components/ui/Button";
import SectionHeading from "../components/ui/SectionHeading";
import StatsCounter from "../components/ui/StatsCounter";
import FeaturedProducts from "../components/product/FeaturedProducts";
import CategoryCard from "../components/product/CategoryCard";
import useStats from "../hooks/useStats";
import useCategories from "../hooks/useCategories";

export default function IndexPage() {
  const { t } = useLanguage();

  return (
    <>
      <Seo
        title={t("seo.homeTitle")}
        description={t("seo.homeDesc")}
        canonical="/"
      />
      <HeroSection />
      <StatsSection />
      <FeaturedSection />
      <CategoriesSection />
      <CtaSection />
    </>
  );
}

function HeroSection() {
  const { t } = useLanguage();
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  function handleSearch(e) {
    e.preventDefault();
    const trimmed = query.trim();
    if (trimmed) {
      navigate(`/products?search=${encodeURIComponent(trimmed)}`);
    }
  }

  return (
    <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white">
      <Container className="py-20 sm:py-28 text-center">
        <motion.h1
          className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {t("index.heroTitle1")}
          <br className="hidden sm:block" /> {t("index.heroTitle2")}
        </motion.h1>

        <motion.p
          className="mt-4 text-lg sm:text-xl text-primary-100 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {t("index.heroSubtitle")}
        </motion.p>

        <motion.form
          onSubmit={handleSearch}
          className="mt-8 flex items-center max-w-lg mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("index.searchPlaceholder")}
            className="flex-1 px-4 py-3 rounded-l-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent-400"
          />
          <button
            type="submit"
            className="px-5 py-3 bg-accent-500 hover:bg-accent-600 text-white font-semibold rounded-r-lg transition-colors"
          >
            <i className="fas fa-search mr-1.5" aria-hidden="true" />
            {t("index.search")}
          </button>
        </motion.form>

        <motion.div
          className="mt-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Button to="/products" variant="outline" className="border-white text-white hover:bg-white/10">
            <i className="fas fa-list mr-2 text-xs" aria-hidden="true" />
            {t("index.browseAll")}
          </Button>
        </motion.div>
      </Container>
    </section>
  );
}

function StatsSection() {
  const { t } = useLanguage();
  const { data: stats, loading } = useStats();

  if (loading || !stats) return null;

  return (
    <section className="bg-white py-16">
      <Container>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          <StatsCounter value={stats.products} label={t("index.statsProducts")} />
          <StatsCounter value={stats.categories} label={t("index.statsCategories")} />
          <StatsCounter value={stats.tags} label={t("index.statsTags")} />
        </div>
      </Container>
    </section>
  );
}

function FeaturedSection() {
  const { t } = useLanguage();

  return (
    <section className="bg-gray-50 py-16">
      <Container>
        <SectionHeading
          title={t("index.featuredTitle")}
          subtitle={t("index.featuredSubtitle")}
        />
        <FeaturedProducts />
      </Container>
    </section>
  );
}

function CategoriesSection() {
  const { t } = useLanguage();
  const { data: categories, loading } = useCategories();

  if (loading) return null;
  if (categories.length === 0) return null;

  return (
    <section className="bg-white py-16">
      <Container>
        <SectionHeading
          title={t("index.categoriesTitle")}
          subtitle={t("index.categoriesSubtitle")}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat, i) => (
            <CategoryCard key={cat.id} category={cat} index={i} />
          ))}
        </div>
      </Container>
    </section>
  );
}

function CtaSection() {
  const { t } = useLanguage();

  return (
    <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white">
      <Container className="py-16 text-center">
        <motion.h2
          className="text-2xl sm:text-3xl font-bold"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          {t("index.ctaTitle")}
        </motion.h2>
        <motion.p
          className="mt-3 text-primary-100 max-w-xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {t("index.ctaSubtitle")}
        </motion.p>
        <motion.div
          className="mt-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Button to="/products" variant="secondary">
            {t("index.ctaButton")}
          </Button>
        </motion.div>
      </Container>
    </section>
  );
}
