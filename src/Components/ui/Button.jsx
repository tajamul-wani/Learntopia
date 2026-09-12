import Spinner from "./Spinner";

// One button system: 4 intents x 3 sizes, with hover / press / focus-ring /
// loading / disabled states. Renders a <button> by default.

const VARIANTS = {
  primary:
    "bg-violet-600 text-white border-violet-400/30 shadow-clay-btn hover:bg-violet-500",
  secondary:
    "bg-surface-2 text-ink-hi border-white/10 shadow-clay-btn hover:bg-surface-3",
  ghost:
    "bg-transparent text-ink border-[rgba(139,124,246,0.18)] hover:bg-surface-2 hover:text-ink-hi",
  danger:
    "bg-state-danger/[0.16] text-state-danger border-state-danger/40 shadow-clay-sm hover:bg-state-danger/25",
};

const SIZES = {
  sm: "px-3.5 py-2 text-xs gap-1.5",
  md: "px-5 py-2.5 text-sm gap-2",
  lg: "px-6 py-3.5 text-base gap-2.5",
};

const Button = ({
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  fullWidth = false,
  type = "button",
  className = "",
  children,
  ...rest
}) => {
  const isDisabled = disabled || loading;
  return (
    <button
      type={type}
      disabled={isDisabled}
      className={`inline-flex items-center justify-center rounded-xl border font-semibold transition-all duration-200
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky focus-visible:ring-offset-2 focus-visible:ring-offset-ground
        active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-50 disabled:active:scale-100
        ${VARIANTS[variant]} ${SIZES[size]} ${fullWidth ? "w-full" : ""} ${className}`}
      {...rest}
    >
      {loading && <Spinner size="sm" />}
      {children}
    </button>
  );
};

export default Button;
