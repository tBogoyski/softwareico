import Container from "./Container";

/**
 * The purple header band that opens /products, /about and /contact, and that
 * carries the breadcrumb on the product detail page.
 *
 * Two decorative layers sit over the gradient. Both are `aria-hidden` and
 * `pointer-events-none`, so neither can catch a click or reach a screen reader:
 *
 *  - a 20px dot grid, drawn in white at 12% opacity. It gives the flat gradient
 *    some texture without introducing a colour that isn't already in the band.
 *  - a hairline along the bottom edge that fades out at both ends, so the band
 *    ends on an edge rather than a hard colour stop.
 *
 * The inline `style` (rather than an arbitrary Tailwind class) matches how the
 * hero's gradients are written in IndexPage.jsx.
 *
 * `padded` is switched off for the detail page's slim breadcrumb bar, which
 * sets its own vertical padding.
 */
export default function PageBand({ children, className = "", padded = true }) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.12) 1px, transparent 0)",
          backgroundSize: "20px 20px",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent"
      />
      <Container
        className={`relative ${padded ? "py-8 sm:py-10" : ""} ${className}`}
      >
        {children}
      </Container>
    </section>
  );
}
