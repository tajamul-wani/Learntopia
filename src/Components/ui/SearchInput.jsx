import Icon from "./Icon";
import { useLanguage } from "../../context/LanguageContext";

// Controlled search box with a leading search icon and a clear button that
// appears once there's a query.

const SearchInput = ({ value, onChange, onClear, placeholder = "Search…", className = "" }) => {
  const { t } = useLanguage();
  return (
  <div className={`relative flex items-center ${className}`}>
    <span className="pointer-events-none absolute left-4 text-ink-low">
      <Icon name="search" size={18} />
    </span>
    <input
      type="search"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      aria-label={placeholder}
      className="w-full rounded-xl border border-white/10 bg-surface-2 py-3 pl-11 pr-11 text-[0.95rem] text-ink-hi outline-none transition-all duration-200 placeholder:text-ink-low focus:border-violet-500 focus:ring-2 focus:ring-violet-500/25 [&::-webkit-search-cancel-button]:hidden"
    />
    {value && (
      <button
        type="button"
        onClick={onClear}
        aria-label={t("ui.clearSearch")}
        className="absolute right-3 grid h-6 w-6 place-items-center rounded-full text-ink-low transition-colors hover:bg-surface-2 hover:text-ink-hi"
      >
        <Icon name="close" size={15} />
      </button>
    )}
  </div>
);
};

export default SearchInput;
