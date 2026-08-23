import { useLanguage } from "../../context/LanguageContext";

const styles = {
  free: "bg-green-100 text-green-800",
  freemium: "bg-blue-100 text-blue-800",
  paid: "bg-amber-100 text-amber-800",
  contact_for_pricing: "bg-gray-100 text-gray-800",
};

/**
 * `sm` is used in the product card footer, where the badge sits beside the
 * category and shouldn't outweigh it. `md` is the original size, still used
 * everywhere else.
 */
const sizes = {
  sm: "gap-1.5 px-2.5 py-1 text-xs",
  md: "gap-1.5 px-3 py-1 text-sm",
};

export default function PricingBadge({ pricingType, size = "md" }) {
  const { t } = useLanguage();

  return (
    <span
      className={`inline-flex flex-shrink-0 items-center rounded-full font-medium ${
        sizes[size] || sizes.md
      } ${styles[pricingType] || styles.free}`}
    >
      <i className="fas fa-coins" aria-hidden="true" />
      {t(`pricing.${pricingType}`) || pricingType}
    </span>
  );
}
