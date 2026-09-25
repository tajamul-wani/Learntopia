/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // --- Legacy token names (kept so nothing breaks), remapped to the darker palette ---
        "primary-bg-color": "#0A0C12",
        "light-bg-color": "#1E2430",
        "button-bg-color": "#7B6AEF",
        "highlighted-btn-bg": "#4EC5E8",

        // --- Refined system: deep slate-indigo ground, indigo-violet accents ---
        ground: {
          DEFAULT: "#0A0C12",
          900: "#0D1019",
          800: "#0F1219",
          700: "#141822",
          600: "#1E2430",
        },
        violet: {
          300: "#C4BCF9",
          400: "#A79BF8",
          500: "#8B7CF6",
          600: "#7B6AEF",
          700: "#6D5CE0",
        },
        // Gold: the reward, streak and XP accent. It used to be written as
        // Tailwind's default amber, so it had no name in the design system and five
        // shades drifted in with nothing choosing between them. Values mirror
        // Tailwind v3 amber exactly, so naming it changed nothing on screen.
        gold: {
          200: "#FDE68A",
          300: "#FCD34D",
          400: "#FBBF24",
          500: "#F59E0B",
          600: "#D97706",
        },
        sky: "#4EC5E8",
        // Themeable via CSS vars (see index.css :root / [data-theme]). Channel
        // syntax keeps Tailwind's alpha modifiers (e.g. text-ink/70) working.
        ink: {
          hi: "rgb(var(--c-ink-hi) / <alpha-value>)", // headings / high contrast
          DEFAULT: "rgb(var(--c-ink) / <alpha-value>)", // body
          low: "rgb(var(--c-ink-low) / <alpha-value>)", // muted
          faint: "rgb(var(--c-ink-faint) / <alpha-value>)", // faintest / disabled
        },
        // --- Clay surfaces: raised, opaque, deep violet-indigo. Sit clearly ABOVE
        //     the ground so the clay dual-shadow reads, but kept rich/muted (not
        //     candy-bright) so cards feel premium. Themeable (see index.css). ---
        surface: {
          DEFAULT: "rgb(var(--c-surface) / <alpha-value>)", // base raised surface
          2: "rgb(var(--c-surface-2) / <alpha-value>)", // one step up
          3: "rgb(var(--c-surface-3) / <alpha-value>)", // highest (active / accents)
        },
        state: {
          success: "#34D399",
          warning: "#F6B93B",
          danger: "#FB7185",
          info: "#4EC5E8",
        },
      },
      fontFamily: {
        sans: ['"Poppins"', '"Segoe UI"', "system-ui", "-apple-system", "sans-serif"],
        // Rounded, friendly display face for headings, numbers and game-UI labels.
        display: ['"Fredoka"', '"Poppins"', "system-ui", "sans-serif"],
      },
      borderRadius: {
        xl2: "1.25rem",
      },
      boxShadow: {
        "custom-shadow": "0 0 0.3rem #000",
        card: "0 8px 30px rgba(0,0,0,0.35)",
        glow: "0 10px 30px rgba(139,99,227,0.22)",
        "glow-sky": "0 10px 30px rgba(123,191,242,0.18)",
        // --- Claymorphism: soft outer drop + a light top rim + a deep inner bottom,
        //     so surfaces read as puffy/molded rather than flat with a shadow.
        //     Composed per-theme in index.css so light/dark swap the recipe. ---
        clay: "var(--shadow-clay)",
        "clay-sm": "var(--shadow-clay-sm)",
        // Molded button: soft drop + bright inner top highlight + inner bottom shade.
        "clay-btn":
          "0 10px 20px -10px rgba(0,0,0,0.7), inset 0 2px 0 rgba(255,255,255,0.24), inset 0 -4px 8px rgba(0,0,0,0.34)",
      },
      screens: {
        mediumPhone: "420px",
        tablets: "525px",
        lgScreen: "1350px",
      },
      keyframes: {
        shimmer: { "100%": { transform: "translateX(100%)" } },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(14px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": { "0%": { opacity: "0" }, "100%": { opacity: "1" } },
        "scale-up": {
          "0%": { opacity: "0", transform: "scale(0.92)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        "popup-pop": {
          "0%": { opacity: "0", transform: "scale(0.94) translateY(8px)" },
          "100%": { opacity: "1", transform: "scale(1) translateY(0)" },
        },
        // The tutor launcher's resting state: a slow sonar ring and a soft
        // breath, so the bot reads as available without ever demanding a tap.
        "tutor-ping": {
          "0%": { transform: "scale(1)", opacity: "0.5" },
          "70%": { transform: "scale(1.5)", opacity: "0" },
          "100%": { transform: "scale(1.5)", opacity: "0" },
        },
        "tutor-breathe": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-4px)" },
        },
      },
      animation: {
        shimmer: "shimmer 1.5s infinite",
        "fade-up": "fade-up 0.6s ease forwards",
        "fade-in": "fade-in 0.5s ease forwards",
        "scale-up": "scale-up 0.35s ease forwards",
        "popup-pop": "popup-pop 0.28s cubic-bezier(0.22,1,0.36,1) forwards",
        "tutor-ping": "tutor-ping 2.8s cubic-bezier(0,0,0.2,1) infinite",
        "tutor-breathe": "tutor-breathe 3.6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
