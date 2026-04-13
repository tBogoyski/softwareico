import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import Container from "../components/layout/Container";
import Seo from "../components/ui/Seo";

export default function NotFoundPage() {
  const { t } = useLanguage();

  return (
    <>
      <Seo title={t("notFound.seoTitle")} description={t("notFound.text")} />

      <Container className="py-20 text-center min-h-[60vh] flex flex-col items-center justify-center">
        <div className="text-8xl font-extrabold text-primary-100">404</div>
        <h1 className="mt-4 text-2xl font-bold text-gray-900">
          {t("notFound.title")}
        </h1>
        <p className="mt-2 text-gray-600 max-w-md mx-auto">
          {t("notFound.text")}
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 bg-primary-600 text-white text-sm font-semibold rounded-lg hover:bg-primary-700 transition-colors"
        >
          <i className="fas fa-house text-xs" aria-hidden="true" />
          {t("notFound.button")}
        </Link>
      </Container>
    </>
  );
}
