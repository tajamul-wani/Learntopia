/**
 * BotAvatar — AI-tutor avatars, drawn as glowing "AI orb" companions.
 *
 * Deliberately NOT robots: the Learntopia app logo is itself a clay robot, so the
 * tutors use a round, glowing orb silhouette (single visor-face + subject emblem +
 * AI spark dots + halo) to read clearly as distinct AI assistants, one per persona:
 * - Robo-Py (Coding / Python)
 * - Count AI-Cula (Math)
 * - CoinBot (Financial Literacy)
 * - PixelBot (HTML / CSS Web Design)
 * - MarketBot (Digital Marketing)
 * - ArtBot (Digital Art & Design)
 */
const BOT_THEMES = {
  "Robo-Py": {
    bg: "from-sky/25 via-sky/10 to-violet-600/20 border-sky/40",
    glow: "shadow-[0_0_22px_rgba(56,189,248,0.4)]",
    svg: (
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <defs>
          <radialGradient id="orbPyBody" cx="38%" cy="32%" r="75%">
            <stop offset="0%" stopColor="#67e8f9" />
            <stop offset="100%" stopColor="#0891b2" />
          </radialGradient>
          <radialGradient id="orbPyHalo" cx="50%" cy="50%" r="50%">
            <stop offset="62%" stopColor="#22d3ee" stopOpacity="0" />
            <stop offset="100%" stopColor="#22d3ee" stopOpacity="0.35" />
          </radialGradient>
        </defs>
        <circle cx="50" cy="50" r="47" fill="url(#orbPyHalo)" />
        <circle cx="16" cy="28" r="2.4" fill="#67e8f9" className="animate-pulse" />
        <circle cx="84" cy="22" r="1.8" fill="#67e8f9" opacity="0.7" />
        <ellipse cx="50" cy="52" rx="33" ry="33" fill="url(#orbPyBody)" stroke="#a5f3fc" strokeWidth="2" />
        <ellipse cx="40" cy="36" rx="15" ry="8" fill="#ffffff" opacity="0.18" />
        <rect x="28" y="40" width="44" height="19" rx="9.5" fill="#06283d" stroke="#22d3ee" strokeWidth="1.5" />
        <circle cx="42" cy="49" r="4.3" fill="#67e8f9" />
        <circle cx="42" cy="49" r="1.7" fill="#ffffff" />
        <circle cx="58" cy="49" r="4.3" fill="#67e8f9" />
        <circle cx="58" cy="49" r="1.7" fill="#ffffff" />
        <path d="M44 64 Q50 68 56 64" fill="none" stroke="#67e8f9" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="50" cy="77" r="8" fill="#06283d" stroke="#22d3ee" strokeWidth="1.5" />
        <text x="50" y="80.5" textAnchor="middle" fill="#67e8f9" fontSize="8" fontWeight="bold" fontFamily="monospace">&lt;/&gt;</text>
      </svg>
    ),
  },
  "Count AI-Cula": {
    bg: "from-violet-500/25 via-violet-400/10 to-violet-700/20 border-violet-500/40",
    glow: "shadow-[0_0_22px_rgba(168,85,247,0.4)]",
    svg: (
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <defs>
          <radialGradient id="orbMathBody" cx="38%" cy="32%" r="75%">
            <stop offset="0%" stopColor="#c4b5fd" />
            <stop offset="100%" stopColor="#6d28d9" />
          </radialGradient>
          <radialGradient id="orbMathHalo" cx="50%" cy="50%" r="50%">
            <stop offset="62%" stopColor="#a78bfa" stopOpacity="0" />
            <stop offset="100%" stopColor="#a78bfa" stopOpacity="0.35" />
          </radialGradient>
        </defs>
        <circle cx="50" cy="50" r="47" fill="url(#orbMathHalo)" />
        <polygon points="16,26 17.5,29.5 21,31 17.5,32.5 16,36 14.5,32.5 11,31 14.5,29.5" fill="#fde047" className="animate-pulse" />
        <circle cx="84" cy="24" r="1.8" fill="#c4b5fd" opacity="0.7" />
        <ellipse cx="50" cy="52" rx="33" ry="33" fill="url(#orbMathBody)" stroke="#ddd6fe" strokeWidth="2" />
        <ellipse cx="40" cy="36" rx="15" ry="8" fill="#ffffff" opacity="0.18" />
        <rect x="28" y="40" width="44" height="19" rx="9.5" fill="#1e1b4b" stroke="#a78bfa" strokeWidth="1.5" />
        <circle cx="42" cy="49" r="4.3" fill="#c4b5fd" />
        <circle cx="42" cy="49" r="1.7" fill="#ffffff" />
        <circle cx="58" cy="49" r="4.3" fill="#c4b5fd" />
        <circle cx="58" cy="49" r="1.7" fill="#ffffff" />
        <path d="M44 64 Q50 68 56 64" fill="none" stroke="#c4b5fd" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="50" cy="77" r="8" fill="#1e1b4b" stroke="#a78bfa" strokeWidth="1.5" />
        <text x="50" y="81" textAnchor="middle" fill="#ddd6fe" fontSize="11" fontWeight="bold">&#8721;</text>
      </svg>
    ),
  },
  "CoinBot": {
    bg: "from-state-success/25 via-state-success/10 to-state-success/20 border-state-success/40",
    glow: "shadow-[0_0_22px_rgba(52,211,153,0.4)]",
    svg: (
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <defs>
          <radialGradient id="orbCoinBody" cx="38%" cy="32%" r="75%">
            <stop offset="0%" stopColor="#6ee7b7" />
            <stop offset="100%" stopColor="#059669" />
          </radialGradient>
          <radialGradient id="orbCoinHalo" cx="50%" cy="50%" r="50%">
            <stop offset="62%" stopColor="#34d399" stopOpacity="0" />
            <stop offset="100%" stopColor="#34d399" stopOpacity="0.35" />
          </radialGradient>
        </defs>
        <circle cx="50" cy="50" r="47" fill="url(#orbCoinHalo)" />
        <circle cx="16" cy="28" r="2.4" fill="#6ee7b7" className="animate-pulse" />
        <circle cx="84" cy="22" r="1.8" fill="#fcd34d" opacity="0.8" />
        <ellipse cx="50" cy="52" rx="33" ry="33" fill="url(#orbCoinBody)" stroke="#a7f3d0" strokeWidth="2" />
        <ellipse cx="40" cy="36" rx="15" ry="8" fill="#ffffff" opacity="0.18" />
        <rect x="28" y="40" width="44" height="19" rx="9.5" fill="#052e26" stroke="#34d399" strokeWidth="1.5" />
        <circle cx="42" cy="49" r="4.3" fill="#6ee7b7" />
        <circle cx="42" cy="49" r="1.7" fill="#ffffff" />
        <circle cx="58" cy="49" r="4.3" fill="#6ee7b7" />
        <circle cx="58" cy="49" r="1.7" fill="#ffffff" />
        <path d="M44 64 Q50 68 56 64" fill="none" stroke="#6ee7b7" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="50" cy="77" r="8" fill="#fcd34d" stroke="#f59e0b" strokeWidth="1.5" />
        <text x="50" y="81" textAnchor="middle" fill="#78350f" fontSize="10" fontWeight="bold">$</text>
      </svg>
    ),
  },
  "PixelBot": {
    bg: "from-sky/25 via-violet-500/10 to-violet-600/20 border-sky/40",
    glow: "shadow-[0_0_22px_rgba(56,189,248,0.4)]",
    svg: (
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <defs>
          <radialGradient id="orbPixBody" cx="38%" cy="32%" r="75%">
            <stop offset="0%" stopColor="#7dd3fc" />
            <stop offset="100%" stopColor="#6366f1" />
          </radialGradient>
          <radialGradient id="orbPixHalo" cx="50%" cy="50%" r="50%">
            <stop offset="62%" stopColor="#38bdf8" stopOpacity="0" />
            <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.35" />
          </radialGradient>
        </defs>
        <circle cx="50" cy="50" r="47" fill="url(#orbPixHalo)" />
        <rect x="13" y="25" width="5" height="5" rx="1" fill="#7dd3fc" className="animate-pulse" />
        <rect x="83" y="21" width="4" height="4" rx="1" fill="#7dd3fc" opacity="0.7" />
        <ellipse cx="50" cy="52" rx="33" ry="33" fill="url(#orbPixBody)" stroke="#bae6fd" strokeWidth="2" />
        <ellipse cx="40" cy="36" rx="15" ry="8" fill="#ffffff" opacity="0.18" />
        <rect x="28" y="40" width="44" height="19" rx="9.5" fill="#0b1220" stroke="#38bdf8" strokeWidth="1.5" />
        <rect x="37.5" y="45" width="8" height="8" rx="1.5" fill="#7dd3fc" />
        <rect x="54.5" y="45" width="8" height="8" rx="1.5" fill="#7dd3fc" />
        <path d="M44 64 Q50 68 56 64" fill="none" stroke="#7dd3fc" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="50" cy="77" r="8" fill="#0b1220" stroke="#38bdf8" strokeWidth="1.5" />
        <text x="50" y="81" textAnchor="middle" fill="#7dd3fc" fontSize="11" fontWeight="bold" fontFamily="monospace">#</text>
      </svg>
    ),
  },
  "MarketBot": {
    bg: "from-state-warning/25 via-state-warning/10 to-amber-500/20 border-state-warning/40",
    glow: "shadow-[0_0_22px_rgba(246,185,59,0.4)]",
    svg: (
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <defs>
          <radialGradient id="orbMktBody" cx="38%" cy="32%" r="75%">
            <stop offset="0%" stopColor="#fcd34d" />
            <stop offset="100%" stopColor="#f59e0b" />
          </radialGradient>
          <radialGradient id="orbMktHalo" cx="50%" cy="50%" r="50%">
            <stop offset="62%" stopColor="#fbbf24" stopOpacity="0" />
            <stop offset="100%" stopColor="#fbbf24" stopOpacity="0.35" />
          </radialGradient>
        </defs>
        <circle cx="50" cy="50" r="47" fill="url(#orbMktHalo)" />
        <circle cx="16" cy="28" r="2.4" fill="#fde68a" className="animate-pulse" />
        <circle cx="84" cy="22" r="1.8" fill="#fde68a" opacity="0.7" />
        <ellipse cx="50" cy="52" rx="33" ry="33" fill="url(#orbMktBody)" stroke="#fef3c7" strokeWidth="2" />
        <ellipse cx="40" cy="36" rx="15" ry="8" fill="#ffffff" opacity="0.2" />
        <rect x="28" y="40" width="44" height="19" rx="9.5" fill="#422006" stroke="#fbbf24" strokeWidth="1.5" />
        <circle cx="42" cy="49" r="4.3" fill="#fde68a" />
        <circle cx="42" cy="49" r="1.7" fill="#ffffff" />
        <circle cx="58" cy="49" r="4.3" fill="#fde68a" />
        <circle cx="58" cy="49" r="1.7" fill="#ffffff" />
        <path d="M43 64 Q50 69 57 64" fill="none" stroke="#fde68a" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="50" cy="77" r="8" fill="#422006" stroke="#fbbf24" strokeWidth="1.5" />
        <polyline points="45,80 48,77 51,79 56,74" fill="none" stroke="#34d399" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <polygon points="56,74 53,74 56,77" fill="#34d399" />
      </svg>
    ),
  },
  "ArtBot": {
    bg: "from-state-danger/25 via-violet-500/10 to-violet-500/20 border-state-danger/40",
    glow: "shadow-[0_0_22px_rgba(251,113,133,0.4)]",
    svg: (
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <defs>
          <radialGradient id="orbArtBody" cx="38%" cy="32%" r="75%">
            <stop offset="0%" stopColor="#fda4af" />
            <stop offset="100%" stopColor="#db2777" />
          </radialGradient>
          <radialGradient id="orbArtHalo" cx="50%" cy="50%" r="50%">
            <stop offset="62%" stopColor="#fb7185" stopOpacity="0" />
            <stop offset="100%" stopColor="#fb7185" stopOpacity="0.35" />
          </radialGradient>
        </defs>
        <circle cx="50" cy="50" r="47" fill="url(#orbArtHalo)" />
        <polygon points="16,26 17,29 20,30 17,31 16,34 15,31 12,30 15,29" fill="#fde047" className="animate-pulse" />
        <circle cx="84" cy="22" r="1.8" fill="#fda4af" opacity="0.7" />
        <ellipse cx="50" cy="52" rx="33" ry="33" fill="url(#orbArtBody)" stroke="#fecdd3" strokeWidth="2" />
        <ellipse cx="40" cy="36" rx="15" ry="8" fill="#ffffff" opacity="0.18" />
        <rect x="28" y="40" width="44" height="19" rx="9.5" fill="#4c0519" stroke="#fb7185" strokeWidth="1.5" />
        <circle cx="42" cy="49" r="4.3" fill="#fda4af" />
        <circle cx="42" cy="49" r="1.7" fill="#ffffff" />
        <circle cx="58" cy="49" r="4.3" fill="#fda4af" />
        <circle cx="58" cy="49" r="1.7" fill="#ffffff" />
        <circle cx="34" cy="55" r="2.6" fill="#fb7185" opacity="0.55" />
        <circle cx="66" cy="55" r="2.6" fill="#fb7185" opacity="0.55" />
        <path d="M44 64 Q50 68 56 64" fill="none" stroke="#fda4af" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="50" cy="77" r="8" fill="#4c0519" stroke="#fb7185" strokeWidth="1.5" />
        <polygon points="50,72 51.6,76.4 56,78 51.6,79.6 50,84 48.4,79.6 44,78 48.4,76.4" fill="#fde047" />
      </svg>
    ),
  },
};

const NAME_MAP = {
  "Robo-Py": "Robo-Py",
  "RoboPy": "Robo-Py",
  "Count AI-Cula": "Count AI-Cula",
  "Count AICula": "Count AI-Cula",
  "Penny Bot": "CoinBot",
  "CoinBot": "CoinBot",
  "Coin Bot": "CoinBot",
  "WebWeaver": "PixelBot",
  "PixelBot": "PixelBot",
  "Viral AI": "MarketBot",
  "MarketBot": "MarketBot",
  "Market Bot": "MarketBot",
  "Pixel Bot": "ArtBot",
  "ArtBot": "ArtBot",
  "Art Bot": "ArtBot",
};

const BotAvatar = ({ name = "Robo-Py", size = "md", className = "" }) => {
  const key = NAME_MAP[name] || "Robo-Py";
  const theme = BOT_THEMES[key] || BOT_THEMES["Robo-Py"];

  const sizeClasses = {
    sm: "w-10 h-10 p-1.5",
    md: "w-20 h-20 p-2.5",
    lg: "w-24 h-24 p-3",
  }[size] || "w-20 h-20 p-2.5";

  return (
    <div
      className={`relative flex items-center justify-center rounded-full bg-gradient-to-br border ${theme.bg} ${theme.glow} transition-transform duration-300 hover:scale-105 ${sizeClasses} ${className}`}
    >
      {theme.svg}
    </div>
  );
};

export default BotAvatar;
