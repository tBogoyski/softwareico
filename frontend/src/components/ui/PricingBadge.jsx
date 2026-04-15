import { useLanguage } from "../../context/LanguageContext";

const styles = {
  free: "bg-green-100 text-green-800",
  freemium: "bg-blue-100 text-blue-800",
  paid: "bg-amber-100 text-amber-800",
  contact_for_pricing: "bg-gray-100 text-gray-800",
};

export default function PricingBadge({ pricingType }) {
  const { t } = useLanguage();

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${
        styles[pricingType] || styles.free
      }`}
    >
      <i className="fas fa-coins" aria-hidden="true" />
      {t(`pricing.${pricingType}`) || pricingType}
    </span>
  );
}
