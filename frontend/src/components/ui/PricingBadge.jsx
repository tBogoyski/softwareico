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
      className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${
        styles[pricingType] || styles.free
      }`}
    >
      {t(`pricing.${pricingType}`) || pricingType}
    </span>
  );
}
