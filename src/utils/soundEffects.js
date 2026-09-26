// Web Audio API Sound Synthesizer Engine for Learntopia
// 100% Free, Zero-Dependency, Offline-Capable Sound Generator

let audioCtx = null;

/**
 * Lazy initializer for AudioContext to satisfy browser autoplay policies.
 * AudioContext is created/resumed on user interaction.
 */
function getAudioContext() {
  if (typeof window === 'undefined') return null;

  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }

  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }

  return audioCtx;
}

/**
 * Play a single synthesized tone with frequency, duration, waveform type, and gain envelope.
 */
function playTone({ freq, duration = 0.15, type = 'sine', startGain = 0.3, endGain = 0.001, delay = 0 }) {
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime + delay;
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);

    gainNode.gain.setValueAtTime(startGain, now);
    gainNode.gain.exponentialRampToValueAtTime(Math.max(endGain, 0.0001), now + duration);

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + duration);
  } catch {
    // Graceful fallback if Web Audio fails
  }
}

/**
 * Sound FX library definitions
 */
export const soundEffects = {
  // Soft bubble tap on button click
  click() {
    const ctx = getAudioContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(400, now);
      osc.frequency.exponentialRampToValueAtTime(700, now + 0.05);

      gainNode.gain.setValueAtTime(0.15, now);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

      osc.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.05);
    } catch { /* Web Audio unavailable — ignore */ }
  },

  // Cheerful 3-note ascending chime for correct answers
  correct() {
    const notes = [523.25, 659.25, 783.99]; // C5, E5, G5
    notes.forEach((freq, idx) => {
      playTone({
        freq,
        duration: 0.14,
        type: 'sine',
        startGain: 0.25,
        delay: idx * 0.08,
      });
    });
  },

  // Gentle low double tone for wrong answers (non-discouraging)
  incorrect() {
    playTone({ freq: 220, duration: 0.12, type: 'triangle', startGain: 0.2, delay: 0 });
    playTone({ freq: 174.61, duration: 0.18, type: 'triangle', startGain: 0.2, delay: 0.1 });
  },

  // Three rising notes as a course opens. Deliberately quieter and shorter than
  // moduleComplete: this marks arriving somewhere, not finishing something.
  courseEnter() {
    const notes = [392.00, 523.25, 659.25]; // G4, C5, E5
    notes.forEach((freq, idx) => {
      playTone({
        freq,
        duration: 0.22,
        type: 'sine',
        startGain: 0.22,
        delay: idx * 0.12,
      });
    });
  },

  // Upbeat 4-note victory chord on module completion
  moduleComplete() {
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      playTone({
        freq,
        duration: 0.25,
        type: 'sine',
        startGain: 0.3,
        delay: idx * 0.1,
      });
    });
  },

  // Triumphant 5-note fanfare on level up
  levelUp() {
    const notes = [392.00, 523.25, 659.25, 783.99, 1046.50]; // G4, C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      playTone({
        freq,
        duration: idx === 4 ? 0.45 : 0.18,
        type: 'triangle',
        startGain: 0.35,
        delay: idx * 0.11,
      });
    });
  },

  // Shimmering sparkle tone for badge unlocks
  badgeUnlock() {
    const freqs = [783.99, 987.77, 1174.66, 1318.51, 1567.98]; // G5, B5, D6, E6, G6
    freqs.forEach((freq, idx) => {
      playTone({
        freq,
        duration: 0.2,
        type: 'sine',
        startGain: 0.2,
        delay: idx * 0.06,
      });
    });
  },

  // Sizzle / whoosh effect for daily login streak flame
  streakBurn() {
    const ctx = getAudioContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(300, now);
      osc.frequency.exponentialRampToValueAtTime(100, now + 0.25);

      gainNode.gain.setValueAtTime(0.15, now);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

      osc.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.25);
    } catch { /* Web Audio unavailable — ignore */ }
  },

  // Soft clock tick sound for timer countdown
  timerTick() {
    playTone({ freq: 650, duration: 0.04, type: 'sine', startGain: 0.08 });
  },

  // Urgent warning tick when quiz timer is <= 5 seconds
  timerUrgent() {
    playTone({ freq: 950, duration: 0.06, type: 'sine', startGain: 0.15 });
  },

  // Distinct low dual-tone alert chime for critical warnings & destructive actions
  warningAlert() {
    playTone({ freq: 280, duration: 0.18, type: 'sawtooth', startGain: 0.18, delay: 0 });
    playTone({ freq: 210, duration: 0.25, type: 'sawtooth', startGain: 0.2, delay: 0.12 });
  },
};
