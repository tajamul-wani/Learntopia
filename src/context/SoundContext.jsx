/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { soundEffects } from '../utils/soundEffects';

const SoundContext = createContext();

const STORAGE_KEY = 'learntopia_sound_muted';

export const SoundProvider = ({ children }) => {
  const [isMuted, setIsMuted] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved !== null ? JSON.parse(saved) : false;
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(isMuted));
    } catch { /* localStorage unavailable — ignore */ }
  }, [isMuted]);

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => !prev);
  }, []);

  const playSound = useCallback(
    (type) => {
      if (isMuted) return;
      if (soundEffects[type]) {
        soundEffects[type]();
      }
    },
    [isMuted]
  );

  const playClick = useCallback(() => playSound('click'), [playSound]);
  const playCorrect = useCallback(() => playSound('correct'), [playSound]);
  const playIncorrect = useCallback(() => playSound('incorrect'), [playSound]);
  const playCourseEnter = useCallback(() => playSound('courseEnter'), [playSound]);
  const playModuleComplete = useCallback(() => playSound('moduleComplete'), [playSound]);
  const playLevelUp = useCallback(() => playSound('levelUp'), [playSound]);
  const playBadgeUnlock = useCallback(() => playSound('badgeUnlock'), [playSound]);
  const playStreakBurn = useCallback(() => playSound('streakBurn'), [playSound]);
  const playTimerTick = useCallback(() => playSound('timerTick'), [playSound]);
  const playTimerUrgent = useCallback(() => playSound('timerUrgent'), [playSound]);
  const playWarningAlert = useCallback(() => playSound('warningAlert'), [playSound]);

  return (
    <SoundContext.Provider
      value={{
        isMuted,
        toggleMute,
        playSound,
        playClick,
        playCourseEnter,
        playCorrect,
        playIncorrect,
        playModuleComplete,
        playLevelUp,
        playBadgeUnlock,
        playStreakBurn,
        playTimerTick,
        playTimerUrgent,
        playWarningAlert,
      }}
    >
      {children}
    </SoundContext.Provider>
  );
};

export const useSound = () => {
  const context = useContext(SoundContext);
  if (!context) {
    throw new Error('useSound must be used within a SoundProvider');
  }
  return context;
};

export default SoundContext;
