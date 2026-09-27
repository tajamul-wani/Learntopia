import Icon from "./Icon";
import LottieIcon from "./LottieIcon";

// Shown when there's nothing to display — guides the next step instead of a
// blank panel. `lottie` plays an animation in the chip instead of the flat
// icon; `icon` stays as its fallback, so a missing or slow file still renders.

const EmptyState = ({ icon = "search", lottie = null, title, description, action, className = "" }) => (
  <div className={`flex flex-col items-center text-center ${className}`}>
    <div className="mb-4 grid h-16 w-16 place-items-center overflow-hidden rounded-2xl bg-surface-2 shadow-clay-sm text-violet-400">
      {lottie ? (
        <LottieIcon src={lottie} size={44} fallbackIcon={icon} />
      ) : (
        <Icon name={icon} size={26} strokeWidth={1.8} />
      )}
    </div>
    {title && <h3 className="mb-1.5 text-lg font-bold text-ink-hi">{title}</h3>}
    {description && <p className="mx-auto mb-5 max-w-sm text-sm text-ink-low">{description}</p>}
    {action}
  </div>
);

export default EmptyState;
