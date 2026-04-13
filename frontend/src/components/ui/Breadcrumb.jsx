import { Link } from "react-router-dom";

/**
 * Breadcrumb navigation.
 *
 * items:   array of { label, to } objects. The last item is the current page.
 * variant: "light" for use on dark/gradient backgrounds, "default" otherwise.
 */
export default function Breadcrumb({ items, variant = "default" }) {
  const isLight = variant === "light";

  const separatorColor = isLight ? "text-white/60" : "text-gray-300";
  const linkColor = isLight
    ? "text-white hover:text-white"
    : "text-primary-600 hover:text-primary-700";
  const currentColor = isLight ? "text-white/75" : "text-gray-500";

  return (
    <nav className="flex items-center gap-2 text-sm" aria-label="Навигация">
      {items.map((item, i) => {
        const isLast = i === items.length - 1;
        return (
          <span key={i} className="flex items-center gap-2">
            {i > 0 && (
              <i
                className={`fas fa-chevron-right text-[10px] ${separatorColor}`}
                aria-hidden="true"
              />
            )}
            {isLast ? (
              <span className={`${currentColor} truncate max-w-[200px] sm:max-w-none`}>
                {item.label}
              </span>
            ) : (
              <Link
                to={item.to}
                className={`${linkColor} transition-colors`}
              >
                {item.label}
              </Link>
            )}
          </span>
        );
      })}
    </nav>
  );
}
