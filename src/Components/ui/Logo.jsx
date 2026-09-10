import { useId } from "react";

// Learntopia brand mark: the app mascot, rendered as a soft clay robot. This is the
// brand's own character and is distinct from the AI-tutor avatars (see BotAvatar,
// which uses glowing "orb" companions so a course tutor never mirrors the logo).
// Note: the name "Robo-Py" belongs to the Python tutor, not this brand mark.
// Vector, so it stays crisp at every size and matches the favicon / splash / OG
// image. `withWordmark` toggles the "Learntopia" text beside it.

const LogoMark = ({ size = 36, className = "" }) => {
  const gid = useId();
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      className={className}
      role="img"
      aria-label="Learntopia"
    >
      <defs>
        <linearGradient id={`${gid}-head`} x1="9" y1="8" x2="39" y2="42" gradientUnits="userSpaceOnUse">
          <stop stopColor="#9D8DF8" />
          <stop offset="1" stopColor="#6D5CE0" />
        </linearGradient>
        <linearGradient id={`${gid}-eye`} x1="0" y1="0" x2="0" y2="1">
          <stop stopColor="#8FE0FB" />
          <stop offset="1" stopColor="#4EC5E8" />
        </linearGradient>
      </defs>

      {/* Ears */}
      <rect x="3.5" y="19" width="5" height="12" rx="2.5" fill="#5B49C9" />
      <rect x="39.5" y="19" width="5" height="12" rx="2.5" fill="#5B49C9" />

      {/* Antenna */}
      <path d="M24 6.2V9.6" stroke="#B9AEF9" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="24" cy="4.6" r="2.4" fill="#4EC5E8" />

      {/* Head (clay) */}
      <rect x="7" y="9" width="34" height="31" rx="11" fill={`url(#${gid}-head)`} />
      {/* Top sheen + subtle rim for the molded clay look */}
      <rect x="9" y="10.6" width="30" height="10" rx="7" fill="#ffffff" fillOpacity="0.12" />
      <rect x="7.6" y="9.6" width="32.8" height="29.8" rx="10.4" stroke="#ffffff" strokeOpacity="0.16" strokeWidth="1" />

      {/* Face screen (recessed) */}
      <rect x="12.5" y="15" width="23" height="15.5" rx="6" fill="#0B0D15" />

      {/* Eyes */}
      <rect x="18" y="18.8" width="4.4" height="6.6" rx="2.2" fill={`url(#${gid}-eye)`} />
      <rect x="25.6" y="18.8" width="4.4" height="6.6" rx="2.2" fill={`url(#${gid}-eye)`} />
      {/* Smile */}
      <path d="M20.6 27.4c1.4 1.5 5.4 1.5 6.8 0" stroke="#4EC5E8" strokeWidth="1.6" strokeLinecap="round" opacity="0.75" />
    </svg>
  );
};

// Responsive by default: the mark scales up with the viewport (CSS width/height
// override the SVG's own size attributes), and the wordmark grows alongside it.
const Logo = ({ withWordmark = true, className = "" }) => (
  <span className={`inline-flex items-center gap-2.5 ${className}`}>
    <LogoMark className="h-10 w-10 sm:h-11 sm:w-11 lg:h-12 lg:w-12" />
    {withWordmark && (
      <span className="hidden font-display text-[1.5rem] font-semibold leading-none tracking-tight text-ink-hi sm:inline lg:text-[1.7rem]">
        Learn<span className="text-gradient">topia</span>
      </span>
    )}
  </span>
);

export { LogoMark };
export default Logo;
