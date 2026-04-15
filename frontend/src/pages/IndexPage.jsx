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
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-950 via-indigo-900 to-violet-950 text-white">
      {/* Animated floating blobs */}
      <motion.div
        className="absolute -top-20 -right-20 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(139,92,246,0.45) 0%, rgba(139,92,246,0.2) 40%, transparent 70%)" }}
        animate={{ x: [0, 120, -80, 0], y: [0, -100, 60, 0], scale: [1, 1.3, 0.85, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        aria-hidden="true"
      />
      <motion.div
        className="absolute top-1/3 -left-28 w-[450px] h-[450px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(34,211,238,0.4) 0%, rgba(34,211,238,0.15) 40%, transparent 70%)" }}
        animate={{ x: [0, 100, -60, 0], y: [0, 70, -90, 0], scale: [1, 0.8, 1.25, 1] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        aria-hidden="true"
      />
      <motion.div
        className="absolute -bottom-24 right-1/4 w-[400px] h-[400px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(244,114,182,0.4) 0%, rgba(244,114,182,0.15) 40%, transparent 70%)" }}
        animate={{ x: [0, -90, 70, 0], y: [0, -80, 100, 0], scale: [1, 1.25, 0.8, 1] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        aria-hidden="true"
      />
      <motion.div
        className="absolute top-1/4 left-1/3 w-[350px] h-[350px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(129,140,248,0.35) 0%, rgba(129,140,248,0.12) 40%, transparent 70%)" }}
        animate={{ x: [0, -100, 80, 0], y: [0, 90, -70, 0], scale: [1, 0.85, 1.2, 1] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        aria-hidden="true"
      />
      <motion.div
        className="absolute top-10 left-2/3 w-[300px] h-[300px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(96,165,250,0.35) 0%, rgba(96,165,250,0.12) 40%, transparent 70%)" }}
        animate={{ x: [0, 80, -100, 0], y: [0, -90, 50, 0], scale: [1, 1.3, 0.8, 1] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        aria-hidden="true"
      />

      <Container className="relative z-10 py-24 sm:py-32 text-center">
        {/* Heading with subtle glow behind it */}
        <div className="relative inline-block">
          <div className="absolute -inset-x-8 -inset-y-4 bg-white/5 blur-2xl rounded-full" />
          <motion.h1
            className="relative text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="bg-gradient-to-r from-white via-blue-100 to-violet-200 bg-clip-text text-transparent">
              {t("index.heroTitle1")}
            </span>
            <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-violet-200 via-blue-100 to-white bg-clip-text text-transparent">
              {" "}{t("index.heroTitle2")}
            </span>
          </motion.h1>
        </div>

        <motion.p
          className="mt-5 text-lg sm:text-xl text-blue-100/80 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          {t("index.heroSubtitle")}
        </motion.p>

        {/* Glassmorphism search bar */}
        <motion.form
          onSubmit={handleSearch}
          className="mt-8 flex items-center max-w-lg mx-auto rounded-xl bg-white/10 backdrop-blur-md border border-white/20 p-1.5 shadow-lg shadow-black/10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("index.searchPlaceholder")}
            className="flex-1 px-4 py-2.5 bg-transparent text-white placeholder-white/70 focus:outline-none"
          />
          <button
            type="submit"
            className="px-5 py-2.5 bg-accent-500 hover:bg-accent-600 text-white font-semibold rounded-lg transition-colors"
          >
            <i className="fas fa-search mr-1.5" aria-hidden="true" />
            {t("index.search")}
          </button>
        </motion.form>

        <motion.div
          className="mt-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Button to="/products" variant="outline" className="border-white/30 text-white hover:bg-white/10 backdrop-blur-sm">
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
            <i className="fas fa-list mr-2 text-xs" aria-hidden="true" />
            {t("index.ctaButton")}
          </Button>
        </motion.div>
      </Container>
    </section>
  );
}
