import { Link } from "react-router-dom";

const variants = {
  primary:
    "bg-primary-600 text-white hover:bg-primary-700 focus-visible:ring-primary-500",
  secondary:
    "bg-accent-500 text-white hover:bg-accent-600 focus-visible:ring-accent-400",
  outline:
    "border border-primary-600 text-primary-600 hover:bg-primary-50 focus-visible:ring-primary-500",
};

/**
 * Reusable button that renders as a <Link> when `to` is provided,
 * or a <button> otherwise.
 */
export default function Button({
  children,
  variant = "primary",
  to,
  className = "",
  ...props
}) {
  const base =
    "inline-flex items-center justify-center px-6 py-3 rounded-lg text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2";
  const classes = `${base} ${variants[variant]} ${className}`;

  if (to) {
    return (
      <Link to={to} className={classes} {...props}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}
