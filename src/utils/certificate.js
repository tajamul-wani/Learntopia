/**
 * The completion certificate, drawn on a canvas.
 *
 * Canvas rather than a library: a client-side PDF or screenshot package costs
 * a few hundred kilobytes on a free tier where LT-104 is already about cutting
 * the cold-boot payload, and this needs none of it. The app's own fonts are
 * bundled (@fontsource), so the certificate is set in the same type as the app.
 *
 * Every value comes from data the app already stores — the display name the
 * learner chose, the course title, `completedAt` on the enrolment, and the
 * course's own badge. No real name is asked for or kept (LT-81), and nothing
 * here needed a new field.
 *
 * The text arrives already translated, so this file stays free of i18n and can
 * be unit-tested without a React tree. Every colour is a design token.
 */

import twConfig from "../../tailwind.config.js";

/** 4:3 landscape, large enough to print at A4 without softening. */
export const CERT_WIDTH = 1600;
export const CERT_HEIGHT = 1131;

/**
 * Canvas takes colour strings, not Tailwind classes, so the certificate has to
 * resolve its palette itself. It reads from the two places the rest of the app
 * is painted from rather than keeping a second copy: the themeable roles as
 * CSS custom properties on :root, and the fixed brand hues from the Tailwind
 * config. Change a token and the document changes with it.
 */
const BRAND = twConfig.theme.extend.colors;

/** "238 241 247" -> "238, 241, 247", the form canvas accepts everywhere. */
const commas = (channels) => channels.trim().split(/\s+/).join(", ");

const hexChannels = (hex) => {
  const n = parseInt(hex.slice(1), 16);
  return `${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}`;
};

/** A themeable role, by its custom property name. */
const role = (name, alpha = 1) =>
  `rgba(${commas(getComputedStyle(document.documentElement).getPropertyValue(name))}, ${alpha})`;

/** A fixed brand hue, by its value in the Tailwind config. */
const brand = (hex, alpha = 1) => `rgba(${hexChannels(hex)}, ${alpha})`;

const palette = () => ({
  inkHi: role("--c-ink-hi"),
  ink: role("--c-ink"),
  inkLow: role("--c-ink-low"),
  ground: role("--c-ground"),
  // Documented in index.css as the cool hairline, used at low alpha.
  hairline: (alpha) => role("--c-border", alpha),
  violet: (alpha = 1) => brand(BRAND.violet[500], alpha),
  violetSoft: brand(BRAND.violet[300]),
  sky: (alpha = 1) => brand(BRAND.sky, alpha),
  gold: (alpha = 1) => brand(BRAND.gold[400], alpha),
});

const DISPLAY = '"Fredoka", "Poppins", system-ui, sans-serif';
const BODY = '"Poppins", "Segoe UI", system-ui, sans-serif';

/**
 * A short, stable id for one learner's copy of one course certificate.
 *
 * Derived rather than stored: the same pair always produces the same code, so
 * two certificates can be told apart and a reprint matches the original,
 * without adding a field or a lookup. It is an identifier, not a verification
 * service, and the certificate does not claim otherwise.
 */
export function certificateId(uid, courseId) {
  const seed = `${uid || "anon"}:${courseId}`;
  // FNV-1a, 32-bit. Small, dependency-free, and good enough to distinguish.
  let hash = 0x811c9dc5;
  for (let i = 0; i < seed.length; i += 1) {
    hash ^= seed.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193) >>> 0;
  }
  const body = hash.toString(36).toUpperCase().padStart(7, "0").slice(0, 7);
  return `LT-${body.slice(0, 4)}-${body.slice(4)}`;
}

const roundedRect = (ctx, x, y, w, h, r) => {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
};

/** Canvas letter-spacing is not dependable across browsers, so space by hand. */
const tracked = (ctx, text, cx, y, spacing) => {
  const chars = [...text];
  const width = chars.reduce((sum, c) => sum + ctx.measureText(c).width + spacing, -spacing);
  // Each glyph is placed by its own left edge, so the alignment has to be left
  // here. Inheriting a centred textAlign centres every letter on its slot
  // instead: wide ones slide left, narrow ones bunch up, and the result reads
  // as broken spacing rather than as tracking.
  const align = ctx.textAlign;
  ctx.textAlign = "left";
  let x = cx - width / 2;
  for (const c of chars) {
    ctx.fillText(c, x, y);
    x += ctx.measureText(c).width + spacing;
  }
  ctx.textAlign = align;
  return width;
};

/** Shrink to fit rather than overflow: course titles here run long. */
const fitted = (ctx, text, maxWidth, startPx, weight, family) => {
  let size = startPx;
  do {
    ctx.font = `${weight} ${size}px ${family}`;
    if (ctx.measureText(text).width <= maxWidth) break;
    size -= 4;
  } while (size > 24);
  return size;
};

const star = (ctx, cx, cy, radius, points = 5) => {
  ctx.beginPath();
  for (let i = 0; i < points * 2; i += 1) {
    const r = i % 2 === 0 ? radius : radius * 0.45;
    const a = (Math.PI / points) * i - Math.PI / 2;
    ctx[i === 0 ? "moveTo" : "lineTo"](cx + Math.cos(a) * r, cy + Math.sin(a) * r);
  }
  ctx.closePath();
};

/** A small diamond, used to break a rule into two halves. */
const diamond = (ctx, cx, cy, r) => {
  ctx.beginPath();
  ctx.moveTo(cx, cy - r);
  ctx.lineTo(cx + r, cy);
  ctx.lineTo(cx, cy + r);
  ctx.lineTo(cx - r, cy);
  ctx.closePath();
};

/** A rule with a diamond set into the middle of it. */
const ruleWithDiamond = (ctx, cx, y, halfWidth, color) => {
  ctx.strokeStyle = color;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(cx - halfWidth, y);
  ctx.lineTo(cx - 18, y);
  ctx.moveTo(cx + 18, y);
  ctx.lineTo(cx + halfWidth, y);
  ctx.stroke();
  ctx.fillStyle = color;
  diamond(ctx, cx, y, 5);
  ctx.fill();
};

/**
 * The hairline weave behind everything.
 *
 * Engraved guilloche is what makes a printed certificate read as a document
 * rather than a poster, and a few hundred diagonal hairlines at 2% opacity do
 * the same job here without an image to ship.
 */
const weave = (ctx, color) => {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 1;
  for (let x = -CERT_HEIGHT; x < CERT_WIDTH; x += 14) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x + CERT_HEIGHT, CERT_HEIGHT);
    ctx.stroke();
  }
  ctx.restore();
};

/**
 * The app's real mark, loaded from public/logo.svg.
 *
 * Drawn from the actual file rather than approximated in canvas paths: a
 * hand-drawn lookalike is not the logo, and the brand should not have two
 * versions of itself. Resolves to null if it cannot load, and the certificate
 * simply sets the wordmark without it.
 */
export function loadCertificateLogo(src = "/logo.svg") {
  return new Promise((resolve) => {
    if (typeof Image === "undefined") {
      resolve(null);
      return;
    }
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

/** Corner flourishes: two short strokes meeting just inside each corner. */
const cornerMarks = (ctx, x, y, w, h, len, color) => {
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.lineCap = "round";
  const corner = (cx, cy, dx, dy) => {
    ctx.beginPath();
    ctx.moveTo(cx + dx * len, cy);
    ctx.lineTo(cx, cy);
    ctx.lineTo(cx, cy + dy * len);
    ctx.stroke();
  };
  corner(x, y, 1, 1);
  corner(x + w, y, -1, 1);
  corner(x, y + h, 1, -1);
  corner(x + w, y + h, -1, -1);
};

/**
 * Draws the certificate. `strings` holds already-translated copy so this stays
 * language-agnostic.
 */
export function drawCertificate(canvas, { learnerName, courseTitle, dateText, badgeName, id, logo = null, strings }) {
  const ctx = canvas.getContext("2d");
  canvas.width = CERT_WIDTH;
  canvas.height = CERT_HEIGHT;
  const mid = CERT_WIDTH / 2;
  const c = palette();

  ctx.fillStyle = c.ground;
  ctx.fillRect(0, 0, CERT_WIDTH, CERT_HEIGHT);

  // The app's ambient glows, so the page looks like it came from Learntopia.
  const glow = (x, y, r, color) => {
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, color);
    g.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, CERT_WIDTH, CERT_HEIGHT);
  };
  glow(260, 110, 700, c.violet(0.22));
  glow(1380, 1040, 700, c.sky(0.15));
  weave(ctx, c.hairline(0.022));

  // A double frame with flourishes, rather than one plain box.
  ctx.strokeStyle = c.violet(0.38);
  ctx.lineWidth = 2.5;
  roundedRect(ctx, 44, 44, CERT_WIDTH - 88, CERT_HEIGHT - 88, 30);
  ctx.stroke();
  ctx.strokeStyle = c.sky(0.22);
  ctx.lineWidth = 1;
  roundedRect(ctx, 62, 62, CERT_WIDTH - 124, CERT_HEIGHT - 124, 22);
  ctx.stroke();
  cornerMarks(ctx, 86, 86, CERT_WIDTH - 172, CERT_HEIGHT - 172, 26, c.gold(0.55));

  ctx.textBaseline = "alphabetic";
  ctx.textAlign = "center";

  // The body runs from the wordmark to the badge chip and sits centred in the
  // band between the inner frame and the footer rule, so the page reads as a
  // single block rather than a top-heavy one.

  // Wordmark, with the real mark beside it when it loaded.
  ctx.font = `600 46px ${DISPLAY}`;
  const learn = "Learn";
  const topia = "topia";
  const markSize = logo ? 56 : 0;
  const markGap = logo ? 18 : 0;
  const wordWidth = ctx.measureText(learn).width + ctx.measureText(topia).width;
  const blockWidth = markSize + markGap + wordWidth;
  let wx = mid - blockWidth / 2;
  if (logo) {
    ctx.drawImage(logo, wx, 232, markSize, markSize);
    wx += markSize + markGap;
  }
  ctx.textAlign = "left";
  ctx.fillStyle = c.inkHi;
  ctx.fillText(learn, wx, 274);
  wx += ctx.measureText(learn).width;
  ctx.fillStyle = c.violet();
  ctx.fillText(topia, wx, 274);
  ctx.textAlign = "center";

  // Eyebrow, held between two hairlines.
  ctx.fillStyle = c.gold();
  ctx.font = `600 20px ${BODY}`;
  const eyebrow = strings.eyebrow.toUpperCase();
  const eyebrowWidth = tracked(ctx, eyebrow, mid, 352, 6);
  ctx.strokeStyle = c.gold(0.35);
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(mid - eyebrowWidth / 2 - 90, 346);
  ctx.lineTo(mid - eyebrowWidth / 2 - 24, 346);
  ctx.moveTo(mid + eyebrowWidth / 2 + 24, 346);
  ctx.lineTo(mid + eyebrowWidth / 2 + 90, 346);
  ctx.stroke();

  ctx.fillStyle = c.ink;
  ctx.font = `400 26px ${BODY}`;
  ctx.fillText(strings.awardedTo, mid, 442);

  const nameSize = fitted(ctx, learnerName, CERT_WIDTH - 360, 96, 600, DISPLAY);
  ctx.fillStyle = c.inkHi;
  ctx.font = `600 ${nameSize}px ${DISPLAY}`;
  ctx.fillText(learnerName, mid, 544);

  // A gold swash under the name, tapering at both ends.
  const nameWidth = Math.min(ctx.measureText(learnerName).width + 80, CERT_WIDTH - 320);
  const swash = ctx.createLinearGradient(mid - nameWidth / 2, 0, mid + nameWidth / 2, 0);
  swash.addColorStop(0, c.gold(0));
  swash.addColorStop(0.5, c.gold(0.75));
  swash.addColorStop(1, c.gold(0));
  ctx.fillStyle = swash;
  ctx.fillRect(mid - nameWidth / 2, 564, nameWidth, 3);

  ctx.fillStyle = c.ink;
  ctx.font = `400 26px ${BODY}`;
  ctx.fillText(strings.forCompleting, mid, 636);

  const titleSize = fitted(ctx, courseTitle, CERT_WIDTH - 300, 60, 600, DISPLAY);
  ctx.fillStyle = c.violetSoft;
  ctx.font = `600 ${titleSize}px ${DISPLAY}`;
  ctx.fillText(courseTitle, mid, 718);

  ruleWithDiamond(ctx, mid, 772, 260, c.hairline(0.26));

  if (badgeName) {
    ctx.font = `600 24px ${BODY}`;
    const label = strings.badgeEarned.replace("{name}", badgeName);
    const chipW = ctx.measureText(label).width + 120;
    const chipX = mid - chipW / 2;
    ctx.fillStyle = c.gold(0.1);
    roundedRect(ctx, chipX, 804, chipW, 58, 29);
    ctx.fill();
    ctx.strokeStyle = c.gold(0.38);
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.fillStyle = c.gold();
    star(ctx, chipX + 40, 833, 15);
    ctx.fill();

    ctx.textAlign = "left";
    ctx.fillText(label, chipX + 68, 842);
    ctx.textAlign = "center";
  }

  // Foot: a hairline, then the two facts that belong on the record.
  ctx.strokeStyle = c.hairline(0.16);
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(150, 1008);
  ctx.lineTo(CERT_WIDTH - 150, 1008);
  ctx.stroke();

  ctx.fillStyle = c.inkLow;
  ctx.font = `400 22px ${BODY}`;
  ctx.textAlign = "left";
  if (dateText) ctx.fillText(`${strings.dateLabel} ${dateText}`, 150, 1050);
  ctx.textAlign = "right";
  ctx.fillText(`${strings.certificateId} ${id}`, CERT_WIDTH - 150, 1050);
  ctx.textAlign = "center";
}

/** Waits for the bundled faces so the canvas is not drawn in a fallback font. */
export async function certificateFontsReady() {
  if (typeof document === "undefined" || !document.fonts) return;
  await Promise.all([
    document.fonts.load(`600 96px ${DISPLAY}`),
    document.fonts.load(`400 26px ${BODY}`),
    document.fonts.load(`600 24px ${BODY}`),
  ]);
  await document.fonts.ready;
}

/** Turns the drawn canvas into a download, named after the course. */
export function downloadCertificate(canvas, courseTitle) {
  const safe = String(courseTitle || "certificate")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60);
  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        resolve(false);
        return;
      }
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `learntopia-${safe}.png`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      resolve(true);
    }, "image/png");
  });
}
