import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useLanguage } from "../context/LanguageContext";
import Container from "../components/layout/Container";
import Seo from "../components/ui/Seo";
import Breadcrumb from "../components/ui/Breadcrumb";
import PricingBadge from "../components/ui/PricingBadge";
import CategoryIcon from "../components/ui/CategoryIcon";
import Button from "../components/ui/Button";
import ImageGallery from "../components/product/ImageGallery";
import ProductCard from "../components/product/ProductCard";
import useProduct from "../hooks/useProduct";
import useProducts from "../hooks/useProducts";
import { mediaUrl } from "../api/client";

function contactHref(type, value) {
  if (type === "email") return `mailto:${value}`;
  if (type === "phone") return `tel:${value}`;
  if (value.startsWith("http")) return value;
  return null;
}

export default function ProductDetailPage() {
  const { t } = useLanguage();
  const { slug } = useParams();
  const { data: product, loading, error } = useProduct(slug);

  if (loading) return <LoadingSkeleton />;

  if (error || !product) {
    return (
      <Container className="py-20 text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-50 flex items-center justify-center">
          <i className="fas fa-exclamation-triangle text-2xl text-red-400" aria-hidden="true" />
        </div>
        <h2 className="text-xl font-bold text-gray-900">{t("detail.notFoundTitle")}</h2>
        <p className="mt-2 text-gray-600">{t("detail.notFoundText")}</p>
        <Button to="/products" className="mt-6">
          {t("detail.backToProducts")}
        </Button>
      </Container>
    );
  }

  const LINK_TYPE_MAP = {
    website: { icon: "fa-globe", label: t("linkType.website") },
    demo: { icon: "fa-play-circle", label: t("linkType.demo") },
    documentation: { icon: "fa-book", label: t("linkType.documentation") },
    video: { icon: "fa-video", label: t("linkType.video") },
    github: { icon: "fa-brands fa-github", label: t("linkType.github") },
  };

  const CONTACT_TYPE_MAP = {
    email: { icon: "fa-envelope", label: t("contactType.email") },
    phone: { icon: "fa-phone", label: t("contactType.phone") },
    facebook: { icon: "fa-brands fa-facebook", label: t("contactType.facebook") },
    linkedin: { icon: "fa-brands fa-linkedin", label: t("contactType.linkedin") },
    other: { icon: "fa-address-card", label: t("contactType.other") },
  };

  const breadcrumbItems = [
    { label: t("nav.home"), to: "/" },
    { label: t("nav.products"), to: "/products" },
  ];
  if (product.category) {
    breadcrumbItems.push({
      label: product.category.name,
      to: `/products?category=${product.category.slug}`,
    });
  }
  breadcrumbItems.push({ label: product.name });

  const seoImage = mediaUrl(product.logo);

  return (
    <>
      <Seo
        title={`${product.name} — Softwareico`}
        description={product.tagline || product.description?.slice(0, 160) || ""}
        ogImage={seoImage}
        canonical={`/products/${product.slug}`}
      />

      {/* Colored header band */}
      <section className="bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800">
        <Container className="py-4">
          <Breadcrumb items={breadcrumbItems} variant="light" />
        </Container>
      </section>

      {/* Product header */}
      <section className="bg-gradient-to-b from-primary-50 to-white border-b border-gray-200">
        <Container className="py-8 sm:py-10">
          <motion.div
            className="flex flex-col sm:flex-row gap-6 items-start"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {product.logo ? (
              <img
                src={mediaUrl(product.logo)}
                alt={`${product.name} logo`}
                loading="lazy"
                className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl object-contain bg-white border border-gray-200 shadow-sm flex-shrink-0 p-2"
              />
            ) : (
              <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl bg-primary-100 flex items-center justify-center flex-shrink-0 shadow-sm">
                <span className="text-primary-600 font-bold text-4xl">
                  {product.name.charAt(0)}
                </span>
              </div>
            )}

            <div className="flex-1 min-w-0">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                {product.name}
              </h1>

              {product.tagline && (
                <p className="mt-2 text-lg text-gray-600">{product.tagline}</p>
              )}

              <div className="mt-4 flex flex-wrap items-center gap-3">
                {product.category && (
                  <Link
                    to={`/products?category=${product.category.slug}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary-50 text-primary-700 text-sm font-medium hover:bg-primary-100 transition-colors"
                  >
                    <CategoryIcon icon={product.category.icon} className="text-xs" />
                    {product.category.name}
                  </Link>
                )}
                {product.tags?.map((tag) => (
                  <Link
                    key={tag.id}
                    to={`/products?tags=${tag.slug}`}
                    className="px-3 py-1.5 rounded-lg bg-gray-100 text-gray-600 text-sm hover:bg-gray-200 transition-colors"
                  >
                    {tag.name}
                  </Link>
                ))}
              </div>

              <div className="mt-5 flex flex-wrap gap-3">
                {product.website_url && (
                  <a
                    href={product.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary-600 text-white text-sm font-semibold rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    <i className="fas fa-external-link-alt text-xs" aria-hidden="true" />
                    {t("detail.visitWebsite")}
                  </a>
                )}
                <span className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent-500 text-white text-sm font-semibold rounded-lg">
                  <i className="fas fa-coins text-xs" aria-hidden="true" />
                  {t(`pricing.${product.pricing_type}`)}
                </span>
                {product.pricing_details && (
                  <span className="inline-flex items-center px-4 py-2.5 bg-accent-50 text-accent-800 text-sm font-medium rounded-lg border border-accent-200">
                    <i className="fas fa-coins mr-2 text-accent-500" aria-hidden="true" />
                    {product.pricing_details}
                  </span>
                )}
              </div>
            </div>
          </motion.div>
        </Container>
      </section>

      {/* Main content */}
      <section className="bg-gray-50 py-8 sm:py-10">
        <Container>
          <div className="lg:grid lg:grid-cols-[1fr_320px] lg:gap-10">
            <div className="space-y-8">
              {/* Description card */}
              {product.description && (
                <motion.div
                  className="bg-white rounded-xl border border-gray-200 p-6"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                >
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    <i className="fas fa-align-left mr-2 text-primary-500" aria-hidden="true" />
                    {t("detail.description")}
                  </h2>
                  <div className="prose prose-gray max-w-none text-gray-700 leading-relaxed whitespace-pre-line">
                    {product.description}
                  </div>
                </motion.div>
              )}

              {/* Image gallery card */}
              {product.images?.length > 0 && (
                <motion.div
                  className="bg-white rounded-xl border border-gray-200 p-6"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.15 }}
                >
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    <i className="fas fa-images mr-2 text-primary-500" aria-hidden="true" />
                    {t("detail.gallery")}
                  </h2>
                  <ImageGallery images={product.images} />
                </motion.div>
              )}

            </div>

            <motion.div
              className="mt-10 lg:mt-0 space-y-6"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              {product.links?.length > 0 && (
                <div className="bg-white rounded-xl border border-gray-200 p-5">
                  <h3 className="flex items-center gap-2 text-xs font-semibold text-primary-600 uppercase tracking-wider mb-4">
                    <i className="fas fa-link" aria-hidden="true" />
                    {t("detail.links")}
                  </h3>
                  <div className="space-y-2">
                    {product.links.map((link) => {
                      const meta = LINK_TYPE_MAP[link.link_type] || LINK_TYPE_MAP.website;
                      return (
                        <a
                          key={link.id}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-50 text-gray-700 hover:text-primary-600 transition-colors group"
                        >
                          <span className="w-8 h-8 rounded-lg bg-primary-50 group-hover:bg-primary-100 flex items-center justify-center flex-shrink-0 transition-colors">
                            <i
                              className={`${meta.icon.startsWith("fa-brands") ? meta.icon : `fas ${meta.icon}`} text-sm text-primary-500`}
                              aria-hidden="true"
                            />
                          </span>
                          <div className="min-w-0">
                            <div className="text-sm font-medium truncate">
                              {link.label || meta.label}
                            </div>
                            <div className="text-xs text-gray-400 truncate">
                              {link.url.replace(/^https?:\/\//, "").split("/")[0]}
                            </div>
                          </div>
                          <i
                            className="fas fa-arrow-up-right-from-square text-xs text-gray-300 group-hover:text-primary-400 ml-auto flex-shrink-0 transition-colors"
                            aria-hidden="true"
                          />
                        </a>
                      );
                    })}
                  </div>
                </div>
              )}

              {product.contacts?.length > 0 && (
                <div className="bg-white rounded-xl border border-gray-200 p-5">
                  <h3 className="flex items-center gap-2 text-xs font-semibold text-primary-600 uppercase tracking-wider mb-4">
                    <i className="fas fa-address-book" aria-hidden="true" />
                    {t("detail.contacts")}
                  </h3>
                  <div className="space-y-2">
                    {product.contacts.map((contact) => {
                      const meta = CONTACT_TYPE_MAP[contact.contact_type] || CONTACT_TYPE_MAP.other;
                      const href = contactHref(contact.contact_type, contact.value);
                      const Tag = href ? "a" : "div";
                      const extraProps = href
                        ? {
                            href,
                            target: href.startsWith("http") ? "_blank" : undefined,
                            rel: href.startsWith("http") ? "noopener noreferrer" : undefined,
                          }
                        : {};

                      return (
                        <Tag
                          key={contact.id}
                          {...extraProps}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-50 text-gray-700 transition-colors group"
                        >
                          <span className="w-8 h-8 rounded-lg bg-primary-50 group-hover:bg-primary-100 flex items-center justify-center flex-shrink-0 transition-colors">
                            <i
                              className={`${meta.icon.startsWith("fa-brands") ? meta.icon : `fas ${meta.icon}`} text-sm text-primary-500`}
                              aria-hidden="true"
                            />
                          </span>
                          <div className="min-w-0">
                            <div className="text-xs text-gray-400">
                              {contact.label || meta.label}
                            </div>
                            <div className="text-sm font-medium truncate">
                              {contact.value}
                            </div>
                          </div>
                        </Tag>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <h3 className="flex items-center gap-2 text-xs font-semibold text-primary-600 uppercase tracking-wider mb-4">
                  <i className="fas fa-info-circle" aria-hidden="true" />
                  {t("detail.info")}
                </h3>
                <div className="space-y-2">
                  {product.category && (
                    <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-700">
                      <span className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center flex-shrink-0">
                        <CategoryIcon icon={product.category.icon} className="text-sm text-primary-500" />
                      </span>
                      <div>
                        <div className="text-xs text-gray-400">{t("detail.category")}</div>
                        <div className="text-sm font-medium">{product.category.name}</div>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-700">
                    <span className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center flex-shrink-0">
                      <i className="fas fa-tag text-sm text-primary-500" aria-hidden="true" />
                    </span>
                    <div>
                      <div className="text-xs text-gray-400">{t("detail.pricing")}</div>
                      <div className="text-sm font-medium">{t(`pricing.${product.pricing_type}`)}</div>
                    </div>
                  </div>
                  {product.is_featured && (
                    <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-700">
                      <span className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center flex-shrink-0">
                        <i className="fas fa-star text-sm text-primary-500" aria-hidden="true" />
                      </span>
                      <div>
                        <div className="text-xs text-gray-400">{t("detail.status")}</div>
                        <div className="text-sm font-medium">{t("detail.featured")}</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </Container>
      </section>

      {product.category && (
        <SimilarProducts
          categorySlug={product.category.slug}
          categoryName={product.category.name}
          excludeSlug={slug}
        />
      )}
    </>
  );
}

function SimilarProducts({ categorySlug, categoryName, excludeSlug }) {
  const { t } = useLanguage();
  const { data: products, loading } = useProducts({ category: categorySlug });

  const similar = products.filter((p) => p.slug !== excludeSlug);

  if (loading || similar.length === 0) return null;

  return (
    <section className="bg-gray-50 border-t border-gray-200 py-10">
      <Container>
        <h2 className="text-xl font-bold text-gray-900 mb-6">
          {t("detail.similarIn")} {categoryName}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {similar.slice(0, 3).map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>
        {similar.length > 3 && (
          <div className="mt-6 text-center">
            <Link
              to={`/products?category=${categorySlug}`}
              className="text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors"
            >
              {t("detail.viewAllIn")} {categoryName} &rarr;
            </Link>
          </div>
        )}
      </Container>
    </section>
  );
}

function LoadingSkeleton() {
  return (
    <>
      <section className="bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800">
        <Container className="py-4">
          <div className="h-4 bg-white/20 rounded w-48 animate-pulse" />
        </Container>
      </section>
      <section className="bg-white border-b border-gray-200">
        <Container className="py-8 sm:py-10">
          <div className="flex flex-col sm:flex-row gap-6 animate-pulse">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gray-200 flex-shrink-0" />
            <div className="flex-1 space-y-3">
              <div className="h-8 bg-gray-200 rounded w-2/3" />
              <div className="h-5 bg-gray-200 rounded w-full max-w-md" />
              <div className="flex gap-2 mt-4">
                <div className="h-8 bg-gray-200 rounded-lg w-24" />
                <div className="h-8 bg-gray-200 rounded-lg w-20" />
                <div className="h-8 bg-gray-200 rounded-lg w-28" />
              </div>
            </div>
          </div>
        </Container>
      </section>
      <section className="py-8 sm:py-10">
        <Container>
          <div className="lg:grid lg:grid-cols-[1fr_320px] lg:gap-10 animate-pulse">
            <div className="space-y-4">
              <div className="h-6 bg-gray-200 rounded w-32" />
              <div className="h-4 bg-gray-200 rounded w-full" />
              <div className="h-4 bg-gray-200 rounded w-full" />
              <div className="h-4 bg-gray-200 rounded w-5/6" />
              <div className="h-4 bg-gray-200 rounded w-4/6" />
            </div>
            <div className="mt-10 lg:mt-0 space-y-6">
              <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-3">
                <div className="h-4 bg-gray-200 rounded w-20" />
                <div className="h-10 bg-gray-200 rounded" />
                <div className="h-10 bg-gray-200 rounded" />
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
