import { motion } from "framer-motion";
import { useLanguage } from "../context/LanguageContext";
import Container from "../components/layout/Container";
import Button from "../components/ui/Button";
import useStats from "../hooks/useStats";

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.4 },
};

export default function AboutPage() {
  const { t } = useLanguage();
  const { data: stats } = useStats();

  const forWhomItems = t("about.forWhomItems").split("|");

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white">
        <Container className="py-16 sm:py-20 text-center">
          <motion.h1
            className="text-3xl sm:text-4xl font-extrabold"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {t("about.title")}
          </motion.h1>
          <motion.p
            className="mt-4 text-lg text-primary-100 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            {t("about.heroSubtitle")}
          </motion.p>
        </Container>
      </section>

      {/* Mission */}
      <section className="bg-white py-16">
        <Container>
          <div className="max-w-3xl mx-auto">
            <motion.div {...fadeIn}>
              <div className="flex items-center gap-3 mb-4">
                <span className="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center">
                  <i className="fas fa-bullseye text-primary-600" aria-hidden="true" />
                </span>
                <h2 className="text-2xl font-bold text-gray-900">
                  {t("about.missionTitle")}
                </h2>
              </div>
              <p className="text-gray-600 leading-relaxed">
                {t("about.missionText")}
              </p>
            </motion.div>
          </div>
        </Container>
      </section>

      {/* Stats band */}
      {stats && (
        <section className="bg-primary-600 text-white py-10">
          <Container>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-3xl sm:text-4xl font-extrabold">
                  {stats.products}+
                </div>
                <div className="mt-1 text-sm text-primary-100">
                  {t("index.statsProducts")}
                </div>
              </div>
              <div>
                <div className="text-3xl sm:text-4xl font-extrabold">
                  {stats.categories}
                </div>
                <div className="mt-1 text-sm text-primary-100">
                  {t("index.statsCategories")}
                </div>
              </div>
              <div>
                <div className="text-3xl sm:text-4xl font-extrabold">
                  {stats.tags}+
                </div>
                <div className="mt-1 text-sm text-primary-100">
                  {t("index.statsTags")}
                </div>
              </div>
            </div>
          </Container>
        </section>
      )}

      {/* Why */}
      <section className="bg-gray-50 py-16">
        <Container>
          <div className="max-w-3xl mx-auto">
            <motion.div {...fadeIn}>
              <div className="flex items-center gap-3 mb-4">
                <span className="w-10 h-10 rounded-xl bg-accent-100 flex items-center justify-center">
                  <i className="fas fa-lightbulb text-accent-600" aria-hidden="true" />
                </span>
                <h2 className="text-2xl font-bold text-gray-900">
                  {t("about.whyTitle")}
                </h2>
              </div>
              <p className="text-gray-600 leading-relaxed">
                {t("about.whyText")}
              </p>
            </motion.div>
          </div>
        </Container>
      </section>

      {/* For whom */}
      <section className="bg-white py-16">
        <Container>
          <div className="max-w-3xl mx-auto">
            <motion.div {...fadeIn}>
              <div className="flex items-center gap-3 mb-6">
                <span className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
                  <i className="fas fa-users text-green-600" aria-hidden="true" />
                </span>
                <h2 className="text-2xl font-bold text-gray-900">
                  {t("about.forWhomTitle")}
                </h2>
              </div>
              <ul className="space-y-3">
                {forWhomItems.map((item, i) => (
                  <motion.li
                    key={i}
                    className="flex items-start gap-3"
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: i * 0.08 }}
                  >
                    <span className="mt-1.5 w-5 h-5 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                      <i className="fas fa-check text-[10px] text-primary-600" aria-hidden="true" />
                    </span>
                    <span className="text-gray-600">{item}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </div>
        </Container>
      </section>

      {/* How we work */}
      <section className="bg-gray-50 py-16">
        <Container>
          <div className="max-w-3xl mx-auto">
            <motion.div {...fadeIn}>
              <div className="flex items-center gap-3 mb-4">
                <span className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
                  <i className="fas fa-gears text-purple-600" aria-hidden="true" />
                </span>
                <h2 className="text-2xl font-bold text-gray-900">
                  {t("about.howTitle")}
                </h2>
              </div>
              <p className="text-gray-600 leading-relaxed">
                {t("about.howText")}
              </p>
            </motion.div>
          </div>
        </Container>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-16">
        <Container className="text-center">
          <motion.h2
            className="text-2xl sm:text-3xl font-bold"
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
          >
            {t("about.ctaTitle")}
          </motion.h2>
          <motion.p
            className="mt-3 text-primary-100 max-w-xl mx-auto"
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            {t("about.ctaText")}
          </motion.p>
          <motion.div
            className="mt-6"
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <Button to="/products" variant="secondary">
              <i className="fas fa-list mr-2 text-xs" aria-hidden="true" />
              {t("about.ctaButton")}
            </Button>
          </motion.div>
        </Container>
      </section>
    </>
  );
}
