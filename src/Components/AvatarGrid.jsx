import { useState } from "react";
import { AVATARS } from "../data/avatarData";
import { useLanguage } from "../context/LanguageContext";

/**
 * Avatar picker grid with Critters/Characters filter tabs.
 *
 * Props:
 *  - selectedId (string|null) — currently selected avatar ID
 *  - onSelect   (fn)          — callback(avatarId)
 */
const AvatarGrid = ({ selectedId, onSelect }) => {
  const { t } = useLanguage();
  const [filter, setFilter] = useState("all");

  const FILTERS = [
    { id: "all", label: t("profileSetup.filterAll") },
    { id: "critters", label: t("profileSetup.filterCritters") },
    { id: "characters", label: t("profileSetup.filterCharacters") },
  ];

  const visible =
    filter === "all" ? AVATARS : AVATARS.filter((a) => a.category === filter);

  return (
    <div>
      {/* Filter tabs */}
      <div className="mb-4 flex items-center gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setFilter(f.id)}
            className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all duration-200 border ${
              filter === f.id
                ? "border-violet-500 bg-violet-500/20 text-violet-300 shadow-glow"
                : "border-white/10 bg-surface-2 shadow-clay-sm text-ink-low hover:text-white hover:border-white/20"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Avatar grid — 4 columns so the picker runs taller (matching the
          identity card) with larger, responsive avatars. */}
      <div className="grid grid-cols-4 gap-3 sm:gap-4">
        {visible.map((avatar) => {
          const isSelected = selectedId === avatar.id;
          return (
            <button
              key={avatar.id}
              type="button"
              onClick={() => onSelect(avatar.id)}
              title={avatar.label}
              className={`group relative flex flex-col items-center gap-1.5 rounded-2xl p-2 sm:p-2.5 transition-all duration-200 border-2 ${
                isSelected
                  ? "border-violet-500 bg-violet-500/15 shadow-glow scale-105"
                  : "border-transparent bg-surface-2 shadow-clay-sm hover:bg-surface-3 hover:scale-105"
              }`}
            >
              {/* Avatar SVG — fills the responsive wrapper */}
              <div className="relative w-11 sm:w-12 lg:w-14 aspect-square">
                {avatar.svg(96)}
                {/* Checkmark overlay */}
                {isSelected && (
                  <div className="absolute -right-0.5 -top-0.5 grid h-5 w-5 place-items-center rounded-full bg-violet-500 text-white shadow-md">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M2 6L5 9L10 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                )}
              </div>

              {/* Label */}
              <span className={`text-[10px] sm:text-[11px] font-semibold leading-tight text-center ${
                isSelected ? "text-violet-300" : "text-ink-faint group-hover:text-ink-low"
              }`}>
                {avatar.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default AvatarGrid;
