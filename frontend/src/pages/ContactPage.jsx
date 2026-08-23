import { useState } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "../context/LanguageContext";
import Container from "../components/layout/Container";
import PageBand from "../components/layout/PageBand";
import Seo from "../components/ui/Seo";
import api from "../api/client";

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.4 },
};

const inputClasses =
  "w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors";

export default function ContactPage() {
  const { t } = useLanguage();

  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(false);
    setFieldErrors({});

    try {
      await api.post("/contact/", form);
      setSuccess(true);
    } catch (err) {
      if (err.response?.status === 400 && err.response?.data) {
        setFieldErrors(err.response.data);
      }
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  function resetForm() {
    setForm({ name: "", email: "", phone: "", message: "" });
    setFieldErrors({});
    setError(false);
    setSuccess(false);
  }

  return (
    <>
      <Seo
        title={t("seo.contactTitle")}
        description={t("seo.contactDesc")}
        canonical="/contact"
      />

      {/* Hero */}
      <PageBand padded={false} className="py-12 sm:py-16 text-center">
        <motion.h1
          className="text-3xl sm:text-4xl font-extrabold tracking-tight"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {t("contact.title")}
        </motion.h1>
        <motion.p
          className="mt-4 text-lg text-primary-100 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          {t("contact.heroSubtitle")}
        </motion.p>
      </PageBand>

      {/* Form */}
      <section className="bg-white py-16">
        <Container>
          <div className="max-w-2xl mx-auto">
            {success ? (
              <motion.div
                className="text-center py-10"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
              >
                <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-green-100 flex items-center justify-center">
                  <i className="fas fa-check text-2xl text-green-600" aria-hidden="true" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {t("contact.successTitle")}
                </h2>
                <p className="mt-3 text-gray-600 max-w-md mx-auto">
                  {t("contact.successText")}
                </p>
                <button
                  onClick={resetForm}
                  className="mt-6 inline-flex items-center justify-center px-6 py-3 rounded-lg text-sm font-semibold bg-primary-600 text-white hover:bg-primary-700 transition-colors"
                >
                  <i className="fas fa-paper-plane mr-2 text-xs" aria-hidden="true" />
                  {t("contact.sendAnother")}
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name */}
                <motion.div {...fadeIn}>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1.5">
                    {t("contact.nameLabel")}
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={form.name}
                    onChange={handleChange}
                    placeholder={t("contact.namePlaceholder")}
                    className={inputClasses}
                  />
                  {fieldErrors.name && (
                    <p className="mt-1 text-sm text-red-600">{fieldErrors.name}</p>
                  )}
                </motion.div>

                {/* Email */}
                <motion.div {...fadeIn} transition={{ duration: 0.4, delay: 0.05 }}>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
                    {t("contact.emailLabel")}
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={form.email}
                    onChange={handleChange}
                    placeholder={t("contact.emailPlaceholder")}
                    className={inputClasses}
                  />
                  {fieldErrors.email && (
                    <p className="mt-1 text-sm text-red-600">{fieldErrors.email}</p>
                  )}
                </motion.div>

                {/* Phone */}
                <motion.div {...fadeIn} transition={{ duration: 0.4, delay: 0.1 }}>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1.5">
                    {t("contact.phoneLabel")}
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder={t("contact.phonePlaceholder")}
                    className={inputClasses}
                  />
                  {fieldErrors.phone && (
                    <p className="mt-1 text-sm text-red-600">{fieldErrors.phone}</p>
                  )}
                </motion.div>

                {/* Message */}
                <motion.div {...fadeIn} transition={{ duration: 0.4, delay: 0.15 }}>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1.5">
                    {t("contact.messageLabel")}
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={5}
                    value={form.message}
                    onChange={handleChange}
                    placeholder={t("contact.messagePlaceholder")}
                    className={`${inputClasses} resize-vertical`}
                  />
                  {fieldErrors.message && (
                    <p className="mt-1 text-sm text-red-600">{fieldErrors.message}</p>
                  )}
                </motion.div>

                {/* Error alert */}
                {error && (
                  <motion.div
                    className="flex items-center gap-3 px-4 py-3 rounded-lg bg-red-50 border border-red-200"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <i className="fas fa-circle-exclamation text-red-500" aria-hidden="true" />
                    <p className="text-sm text-red-700">{t("contact.errorText")}</p>
                  </motion.div>
                )}

                {/* Submit */}
                <motion.div {...fadeIn} transition={{ duration: 0.4, delay: 0.2 }}>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3 rounded-lg text-sm font-semibold bg-primary-600 text-white hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {loading ? (
                      <>
                        <i className="fas fa-spinner fa-spin mr-2 text-xs" aria-hidden="true" />
                        {t("contact.sending")}
                      </>
                    ) : (
                      <>
                        <i className="fas fa-paper-plane mr-2 text-xs" aria-hidden="true" />
                        {t("contact.submit")}
                      </>
                    )}
                  </button>
                </motion.div>
              </form>
            )}
          </div>
        </Container>
      </section>
    </>
  );
}
