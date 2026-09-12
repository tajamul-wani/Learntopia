import { createContext, useCallback, useContext, useMemo, useState } from "react";

/**
 * Tracks whether the app is in an "immersive" moment — a module or quiz in
 * progress — so chrome that invites navigation (the mobile bottom bar) can get
 * out of the way. Strict Focus Mode already blocks those navigations; this stops
 * the UI offering them in the first place.
 */
const NavChromeContext = createContext({ immersive: false, setImmersive: () => {} });

export const NavChromeProvider = ({ children }) => {
  const [immersive, setImmersiveState] = useState(false);
  const setImmersive = useCallback((value) => setImmersiveState(Boolean(value)), []);
  const value = useMemo(() => ({ immersive, setImmersive }), [immersive, setImmersive]);
  return <NavChromeContext.Provider value={value}>{children}</NavChromeContext.Provider>;
};

// Same pattern as AuthContext: the provider and its hook belong together, so the
// fast-refresh rule is silenced here rather than splitting a one-line hook out.
// eslint-disable-next-line react-refresh/only-export-components
export const useNavChrome = () => useContext(NavChromeContext);
