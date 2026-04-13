import { Helmet } from "react-helmet-async";
import { useLanguage } from "../../context/LanguageContext";

/**
 * Sets page title, description, and OpenGraph meta tags.
 *
 * Props:
 *   title       – page title (shown in browser tab)
 *   description – meta description
 *   ogImage     – optional OpenGraph image URL
 *   canonical   – optional canonical URL path (e.g. "/products")
 */
export default function Seo({ title, description, ogImage, canonical }) {
  const { language } = useLanguage();
  const baseUrl = "https://softwareico.com";

  return (
    <Helmet>
      <html lang={language} />
      <title>{title}</title>
      <meta name="description" content={description} />

      {/* OpenGraph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:site_name" content="Softwareico" />
      <meta property="og:type" content="website" />
      {ogImage && <meta property="og:image" content={ogImage} />}
      {canonical && <meta property="og:url" content={`${baseUrl}${canonical}`} />}

      {/* Canonical */}
      {canonical && <link rel="canonical" href={`${baseUrl}${canonical}`} />}
    </Helmet>
  );
}
