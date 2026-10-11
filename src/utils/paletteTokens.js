import twConfig from "../../tailwind.config.js";

/**
 * The palette, as "r, g, b" channel strings, for the places that cannot use
 * a Tailwind class: canvas takes colour strings, not classes.
 *
 * Everything here is read from the design system rather than copied out of
 * it — the brand hues from `tailwind.config.js` and the themeable roles
 * from the custom properties on `:root`. Nothing is written twice, so a
 * token change moves the canvases with it.
 *
 * Two rules the home page depends on:
 *
 *  - never composite these additively. Two tokens added together make a
 *    third colour that is in no palette; a gold light over a violet one
 *    turned the whole page brown, and a hex audit cannot see it because
 *    every input was legitimate.
 *  - never introduce a value that is not here.
 */
const brand = twConfig.theme.extend.colors;

const channels = (hex) => {
  const n = parseInt(hex.slice(1), 16);
  return `${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}`;
};

export const CHANNEL = {
  violet: channels(brand.violet[500]),
  violetSoft: channels(brand.violet[300]),
  violetDeep: channels(brand.violet[600]),
  sky: channels(brand.sky),
  gold: channels(brand.gold[400]),
  success: channels(brand.state.success),
};

/** A themeable role, by custom property name, as "r, g, b". */
export const roleChannels = (name) => {
  if (typeof window === "undefined") return "0, 0, 0";
  const value = getComputedStyle(document.documentElement).getPropertyValue(name);
  return value.trim().split(/\s+/).join(", ") || "0, 0, 0";
};

/** `rgba()` from a channel string, so call sites stay readable. */
export const tone = (chan, alpha) => `rgba(${chan}, ${alpha})`;
