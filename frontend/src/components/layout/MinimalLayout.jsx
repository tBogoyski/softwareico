import { Helmet } from "react-helmet-async";
import { useLanguage } from "../../context/LanguageContext";
import Container from "./Container";

export default function MinimalLayout({ children }) {
  const { language, setLanguage } = useLanguage();

  function toggleLanguage() {
    setLanguage(language === "bg" ? "en" : "bg");
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Helmet>
        <meta name="robots" content="noindex,nofollow" />
      </Helmet>
      <header className="bg-white border-b border-gray-100">
        <Container>
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center">
                <i className="fas fa-cubes text-white text-sm" aria-hidden="true" />
              </span>
              <span className="text-xl font-bold text-gray-900">
                Software<span className="text-primary-600">ico</span>
              </span>
            </div>
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors"
              aria-label="Switch language"
            >
              <i className="fas fa-globe text-xs" aria-hidden="true" />
              {language === "bg" ? "EN" : "BG"}
            </button>
          </div>
        </Container>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  );
}
