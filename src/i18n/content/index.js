/**
 * The content overlay, fetched for one language at a time.
 *
 * `translations.js` holds the UI dictionary and stays in the entry chunk,
 * because `t()` is called during render and the active language has to be
 * there synchronously. This is the other half: the bodies of text that only
 * one route renders — course and quiz copy, the in-app docs, the legal pages.
 *
 * The rule for deciding where a new string goes is what the reader waits on,
 * not how long the string is: anything read while painting, or by an effect
 * that fires on mount, goes in `translations.js`. Everything here is reached
 * through a lazy route that is itself still loading.
 *
 * Splitting it per language is the whole point. English has no `courseData`
 * or `quizzesData` at all — those namespaces translate the real content in
 * `coursesData.js` and `quizData.js` — so an English visitor was downloading
 * 41K gzip of Spanish they could never see.
 *
 * Each language loads once and is remembered, so switching back is free.
 */
const loaders = {
  en: () => import("./en.js"),
  es: () => import("./es.js"),
};

const loaded = new Map();
const inFlight = new Map();

/** What has already arrived, or undefined. Synchronous, for the first render. */
export const contentFor = (lang) => loaded.get(lang);

/**
 * Fetch one language's overlay. Safe to call repeatedly: the same promise is
 * handed back while a fetch is in flight, and a language that fails to load
 * resolves to an empty overlay rather than taking the page down with it —
 * every key in here has a fallback to the English source.
 */
export function loadContent(lang) {
  if (loaded.has(lang)) return Promise.resolve(loaded.get(lang));
  if (inFlight.has(lang)) return inFlight.get(lang);

  const load = (loaders[lang] || loaders.en)()
    .then((module) => {
      const content = module.default || {};
      loaded.set(lang, content);
      inFlight.delete(lang);
      return content;
    })
    .catch(() => {
      loaded.set(lang, {});
      inFlight.delete(lang);
      return {};
    });

  inFlight.set(lang, load);
  return load;
}

/**
 * The language the app is about to start in, read the way LanguageProvider
 * reads it, so a route can wait for the right overlay before the provider
 * has mounted. A later language switch is handled by the provider, which
 * reloads and re-renders.
 */
const startingLanguage = () => {
  try {
    const saved = localStorage.getItem("learntopia_lang");
    return saved && loaders[saved] ? saved : "en";
  } catch {
    return "en";
  }
};

/** For a route that reads the overlay directly and must not render without it. */
export const loadActiveContent = () => loadContent(startingLanguage());
