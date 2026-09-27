// Learntopia brand logo: a glowing faceted bulb with paper-cut rays, on a
// transparent background. The artwork lives in public/logo.svg so the navbar,
// footer, README and structured data all share one file. The favicon
// (public/favicon.svg) is the same bulb with heavier strokes for tab sizes.
// It is loaded as an <img>, so its internal gradient/filter ids never collide
// with other inline SVGs on the page.
//
// The wordmark used to hide below `sm`, which had it missing on phones — where
// there is room — and present between 1024 and 1280, which is the one band
// where the row is genuinely tight: the desktop links appear at 1024, and a
// signed-in learner also carries a name pill and a Sign Out button.
//
// `tightNav` is the navbar's version: shown on phones, hidden in that band, and
// also hidden below 360px, where the logo, the wordmark and the language and
// sound controls together came to 354px on a 320px screen and scrolled the page
// sideways. The footer has room, so it passes nothing and always shows it.

const Logo = ({ withWordmark = true, tightNav = false, className = "" }) => (
  <span className={`inline-flex items-center gap-2 sm:gap-2.5 ${className}`}>
    <img
      src="/logo.svg"
      alt="Learntopia"
      width={48}
      height={48}
      decoding="async"
      className="h-10 w-10 shrink-0 sm:h-11 sm:w-11 lg:h-12 lg:w-12"
    />
    {withWordmark && (
      <span
        className={`font-display text-[1.25rem] font-semibold leading-none tracking-tight text-ink-hi sm:text-[1.5rem] lg:text-[1.7rem] ${
          tightNav ? "hidden min-[360px]:inline lg:hidden xl:inline" : ""
        }`}
      >
        Learn<span className="text-gradient">topia</span>
      </span>
    )}
  </span>
);

export default Logo;
