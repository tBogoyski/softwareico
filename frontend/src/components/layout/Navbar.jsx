import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";
import Container from "./Container";

export default function Navbar() {
  const { t, language, setLanguage } = useLanguage();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { to: "/", label: t("nav.home"), icon: "fa-house" },
    { to: "/products", label: t("nav.products"), icon: "fa-list" },
    { to: "/about", label: t("nav.about"), icon: "fa-circle-info" },
    { to: "/contact", label: t("nav.contact"), icon: "fa-envelope" },
  ];

  function toggleLanguage() {
    setLanguage(language === "bg" ? "en" : "bg");
  }

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-sm">
      <Container>
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <span className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center">
              <i className="fas fa-cubes text-white text-sm" aria-hidden="true" />
            </span>
            <span className="text-xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors">
              Software<span className="text-primary-600">ico</span>
            </span>
          </Link>

          {/* Desktop links + language toggle */}
          <div className="hidden md:flex items-center gap-2">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === "/"}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? "bg-primary-50 text-primary-700"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`
                }
              >
                <i className={`fas ${link.icon} text-xs`} aria-hidden="true" />
                {link.label}
              </NavLink>
            ))}

            {/* Divider */}
            <div className="w-px h-6 bg-gray-200 mx-1" />

            {/* Language toggle */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all"
              aria-label="Switch language"
            >
              <i className="fas fa-globe text-xs" aria-hidden="true" />
              {language === "bg" ? "EN" : "BG"}
            </button>
          </div>

          {/* Mobile: language toggle + hamburger */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={toggleLanguage}
              className="px-2.5 py-1.5 rounded-lg border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
              aria-label="Switch language"
            >
              {language === "bg" ? "EN" : "BG"}
            </button>
            <button
              type="button"
              className="p-2 text-gray-600 hover:text-primary-600"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              <i className={`fas ${mobileOpen ? "fa-xmark" : "fa-bars"} text-xl`} />
            </button>
          </div>
        </div>

        {/* Mobile dropdown */}
        {mobileOpen && (
          <div className="md:hidden pb-3 pt-1 border-t border-gray-100 space-y-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === "/"}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? "bg-primary-50 text-primary-700"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`
                }
              >
                <i className={`fas ${link.icon} text-xs`} aria-hidden="true" />
                {link.label}
              </NavLink>
            ))}
          </div>
        )}
      </Container>
    </nav>
  );
}
