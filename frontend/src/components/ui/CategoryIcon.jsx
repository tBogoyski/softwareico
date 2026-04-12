/**
 * Renders a Font Awesome icon from a database icon string.
 *
 * The DB stores values like "fa-users", "fa-robot", "fa-shopping-cart".
 * We prepend "fas" (solid style) since that matches the seed data icons.
 * If the value already includes a style prefix (fas, far, fab), it's used as-is.
 */
export default function CategoryIcon({ icon, className = "" }) {
  if (!icon) return null;

  const fullClass = icon.startsWith("fa-") ? `fas ${icon}` : icon;

  return <i className={`${fullClass} ${className}`} aria-hidden="true" />;
}
