// Learntopia brand logo: a glowing faceted bulb with paper-cut rays, on a
// transparent background. The artwork lives in public/logo.svg so the navbar,
// footer, README and structured data all share one file. The favicon
// (public/favicon.svg) is the same bulb with heavier strokes for tab sizes.
// It is loaded as an <img>, so its internal gradient/filter ids never collide
// with other inline SVGs on the page. `withWordmark` toggles the "Learntopia"
// text beside it.

// Responsive by default: the logo scales up with the viewport, and the wordmark
// grows alongside it.
const Logo = ({ withWordmark = true, className = "" }) => (
  <span className={`inline-flex items-center gap-2.5 ${className}`}>
    <img
      src="/logo.svg"
      alt="Learntopia"
      width={48}
      height={48}
      decoding="async"
      className="h-10 w-10 shrink-0 sm:h-11 sm:w-11 lg:h-12 lg:w-12"
    />
    {withWordmark && (
      <span className="hidden font-display text-[1.5rem] font-semibold leading-none tracking-tight text-ink-hi sm:inline lg:text-[1.7rem]">
        Learn<span className="text-gradient">topia</span>
      </span>
    )}
  </span>
);

export default Logo;
