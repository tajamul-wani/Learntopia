/**
 * BotAvatar — Leo, drawn as a glowing "AI orb" companion.
 *
 * Deliberately NOT a robot: the Learntopia app logo is itself a clay robot, so
 * the tutor uses a round, glowing orb silhouette to read clearly as a separate
 * AI assistant. One face, everywhere — Leo is the only tutor on the platform.
 *
 * The idle shimmer runs forever so Leo reads as awake and available; the app's
 * global reduced-motion rule stops it for anyone who asks for that.
 */
const BotAvatar = ({ size = "md", className = "", animated = true }) => {
  const sizeClasses = {
    sm: "w-10 h-10 p-1.5",
    md: "w-20 h-20 p-2.5",
    lg: "w-24 h-24 p-3",
  }[size] || "w-20 h-20 p-2.5";

  return (
    <div
      className={`relative flex items-center justify-center rounded-full border bg-gradient-to-br from-sky/25 via-sky/10 to-violet-600/20 border-sky/40 shadow-[0_0_22px_rgba(78,197,232,0.4)] transition-transform duration-300 hover:scale-105 ${sizeClasses} ${className}`}
    >
      <svg viewBox="0 0 100 100" className="w-full h-full" role="img" aria-label="Leo">
        <defs>
          <radialGradient id="leoBody" cx="38%" cy="32%" r="75%">
            <stop offset="0%" stopColor="#67e8f9" />
            <stop offset="100%" stopColor="#0891b2" />
          </radialGradient>
          <radialGradient id="leoHalo" cx="50%" cy="50%" r="50%">
            <stop offset="62%" stopColor="#22d3ee" stopOpacity="0" />
            <stop offset="100%" stopColor="#22d3ee" stopOpacity="0.35" />
          </radialGradient>
        </defs>

        <circle cx="50" cy="50" r="47" fill="url(#leoHalo)" />

        {/* Thinking sparks, offset so they never blink in unison. */}
        <circle cx="16" cy="28" r="2.4" fill="#67e8f9" className={animated ? "animate-pulse" : ""} />
        <circle cx="84" cy="22" r="1.8" fill="#a79bf8" opacity="0.75" className={animated ? "animate-pulse" : ""} style={animated ? { animationDelay: "0.7s" } : undefined} />

        <ellipse cx="50" cy="52" rx="33" ry="33" fill="url(#leoBody)" stroke="#a5f3fc" strokeWidth="2" />
        <ellipse cx="40" cy="36" rx="15" ry="8" fill="#ffffff" opacity="0.18" />

        {/* Visor face: two eyes and a smile, the whole of Leo's expression. */}
        <rect x="27" y="40" width="46" height="20" rx="10" fill="#06283d" stroke="#22d3ee" strokeWidth="1.5" />
        <circle cx="41" cy="50" r="4.4" fill="#67e8f9" />
        <circle cx="41" cy="50" r="1.7" fill="#ffffff" />
        <circle cx="59" cy="50" r="4.4" fill="#67e8f9" />
        <circle cx="59" cy="50" r="1.7" fill="#ffffff" />
        <path d="M43 66 Q50 71 57 66" fill="none" stroke="#67e8f9" strokeWidth="2.5" strokeLinecap="round" />

        {/* Antenna spark — the "I'm listening" tell. */}
        <line x1="50" y1="19" x2="50" y2="12" stroke="#22d3ee" strokeWidth="2" strokeLinecap="round" />
        <circle cx="50" cy="10" r="3.4" fill="#a79bf8" className={animated ? "animate-pulse" : ""} />
      </svg>
    </div>
  );
};

export default BotAvatar;
