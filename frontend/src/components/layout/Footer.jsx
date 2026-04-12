import { Link } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";
import Container from "./Container";

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-gray-900 text-gray-300">
      <Container className="py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <Link to="/" className="text-xl font-bold text-white">
              Software<span className="text-primary-400">ico</span>
            </Link>
            <p className="mt-3 text-sm text-gray-400">{t("footer.tagline")}</p>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
              {t("footer.links")}
            </h3>
            <ul className="mt-3 space-y-2">
              <li>
                <Link
                  to="/"
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  {t("nav.home")}
                </Link>
              </li>
              <li>
                <Link
                  to="/products"
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  {t("nav.products")}
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  {t("nav.about")}
                </Link>
              </li>
            </ul>
          </div>

          {/* About */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
              {t("footer.about")}
            </h3>
            <p className="mt-3 text-sm text-gray-400">
              {t("footer.aboutText")}
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-gray-800 text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} Softwareico. {t("footer.rights")}
        </div>
      </Container>
    </footer>
  );
}
