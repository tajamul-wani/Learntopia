/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from 'react';
import { LANGUAGES, translations } from '../i18n/translations';
import { contentTranslations } from '../i18n/contentTranslations';

const LanguageContext = createContext();

// Deep-merge the bulk course/quiz content translations (kept in their own file
// to keep translations.js manageable) onto the base UI dictionaries. A deep
// merge (objects by key, arrays by index) lets the content file add ONLY the
// deep lesson content (contentSections/exercises) onto the course metadata that
// already lives in translations.js, without duplicating it. English is omitted:
// t() and the localization utils fall back to English / the raw data files.
const isPlainObject = (v) => v && typeof v === 'object' && !Array.isArray(v);

const deepMerge = (base, extra) => {
  if (Array.isArray(base) && Array.isArray(extra)) {
    const out = base.slice();
    extra.forEach((item, i) => {
      out[i] = (isPlainObject(out[i]) && isPlainObject(item)) || (Array.isArray(out[i]) && Array.isArray(item))
        ? deepMerge(out[i], item)
        : item;
    });
    return out;
  }
  if (isPlainObject(base) && isPlainObject(extra)) {
    const out = { ...base };
    for (const key of Object.keys(extra)) {
      out[key] = key in base ? deepMerge(base[key], extra[key]) : extra[key];
    }
    return out;
  }
  return extra;
};

const mergedTranslations = Object.keys(translations).reduce((acc, lang) => {
  acc[lang] = deepMerge(translations[lang], contentTranslations[lang] || {});
  return acc;
}, {});

export const LanguageProvider = ({ children }) => {
  const [currentLang, setCurrentLang] = useState(() => {
    const saved = localStorage.getItem('learntopia_lang');
    // Only restore languages that are currently exposed in the dropdown, so a
    // hidden/removed language saved earlier can't get stuck active.
    if (saved && LANGUAGES.some((l) => l.code === saved)) {
      return saved;
    }
    return 'en';
  });

  const [isChangingLang, setIsChangingLang] = useState(false);
  const [targetLangObj, setTargetLangObj] = useState(null);

  const activeLangObj = LANGUAGES.find(l => l.code === currentLang) || LANGUAGES[0];

  useEffect(() => {
    localStorage.setItem('learntopia_lang', currentLang);
    // Still driven by the language's own `dir`, so adding a right-to-left
    // language later is a data change rather than re-deriving this. Arabic
    // was the only one, and an `isRTL` flag that can never be true is a
    // branch nothing exercises.
    document.documentElement.dir = activeLangObj.dir || 'ltr';
    document.documentElement.lang = currentLang;
  }, [currentLang, activeLangObj]);

  const setLanguage = (code) => {
    if (LANGUAGES.some((l) => l.code === code) && code !== currentLang) {
      const nextLangObj = LANGUAGES.find((l) => l.code === code);
      setTargetLangObj(nextLangObj);
      setIsChangingLang(true);
      localStorage.setItem('learntopia_lang', code);

      setTimeout(() => {
        setCurrentLang(code);
      }, 50);

      setTimeout(() => {
        setIsChangingLang(false);
        setTargetLangObj(null);
      }, 350);
    }
  };

  /**
   * Helper function to fetch nested translation string by key path with optional interpolation parameters
   * e.g., t('quiz.questionCount', { current: 1, total: 10 }) => "Question 1 of 10"
   */
  const t = (path, params = {}) => {
    if (!path) return '';
    const keys = path.split('.');
    
    // Search in active language dictionary
    let result = mergedTranslations[currentLang];
    for (const key of keys) {
      if (result && result[key] !== undefined) {
        result = result[key];
      } else {
        result = null;
        break;
      }
    }

    if (result === null || typeof result !== 'string') {
      // Fallback to English dictionary if key is missing in active language
      let fallback = mergedTranslations['en'];
      for (const key of keys) {
        if (fallback && fallback[key] !== undefined) {
          fallback = fallback[key];
        } else {
          fallback = path; // Return key path itself if not found
          break;
        }
      }
      result = typeof fallback === 'string' ? fallback : path;
    }

    if (typeof result === 'string' && params && typeof params === 'object') {
      Object.keys(params).forEach(paramKey => {
        result = result.replace(new RegExp(`\\{${paramKey}\\}`, 'g'), params[paramKey]);
      });
    }

    return result;
  };

  // Return the RAW translated value for a key path (array/object/string), with
  // English fallback. Used for structured content like the Privacy/Terms/Docs
  // section lists, which t() (string-only) can't return.
  const tRaw = (path) => {
    const keys = (path || '').split('.');
    const lookup = (dict) => {
      let node = dict;
      for (const key of keys) {
        if (node && node[key] !== undefined) node = node[key];
        else return undefined;
      }
      return node;
    };
    const active = lookup(mergedTranslations[currentLang]);
    return active !== undefined ? active : lookup(mergedTranslations['en']);
  };

  return (
    <LanguageContext.Provider value={{ currentLang, setLanguage, languages: LANGUAGES, activeLangObj, t, tRaw }}>
      {children}

      {/* Smooth, non-blocking glassmorphism language transition overlay */}
      {isChangingLang && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-ground-900/60 backdrop-blur-md transition-opacity duration-300 animate-fade-in">
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-violet-500/30 bg-ground-800/90 px-6 py-5 shadow-2xl shadow-violet-500/20 text-center">
            <div className="relative flex items-center justify-center">
              <div className="h-10 w-10 animate-spin rounded-full border-2 border-violet-500 border-t-transparent" />
              <span className="absolute text-base">{targetLangObj?.flag || activeLangObj.flag}</span>
            </div>
            <div className="text-sm font-bold text-white">
              Updating Language...
            </div>
          </div>
        </div>
      )}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
