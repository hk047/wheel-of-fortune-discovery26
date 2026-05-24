let audioContext: AudioContext | null = null;
let muted = false;

export function setAudioMuted(value: boolean): void {
  muted = value;
}

export function getAudioMuted(): boolean {
  return muted;
}

export async function unlockAudio(): Promise<void> {
  const context = getAudioContext();
  if (context.state === 'suspended') {
    await context.resume();
  }
}

export function playTick(intensity = 0.6): void {
  if (muted) return;
  const context = getAudioContext();
  const now = context.currentTime;
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  const filter = context.createBiquadFilter();

  oscillator.type = 'square';
  oscillator.frequency.setValueAtTime(900 + intensity * 550, now);
  filter.type = 'highpass';
  filter.frequency.setValueAtTime(650, now);
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(0.06 * intensity, now + 0.006);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.04);

  oscillator.connect(filter);
  filter.connect(gain);
  gain.connect(context.destination);
  oscillator.start(now);
  oscillator.stop(now + 0.045);
}

export function playStopClack(): void {
  if (muted) return;
  const context = getAudioContext();
  const now = context.currentTime;
  [220, 145].forEach((frequency, index) => {
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = 'triangle';
    oscillator.frequency.setValueAtTime(frequency, now + index * 0.055);
    gain.gain.setValueAtTime(0.0001, now + index * 0.055);
    gain.gain.exponentialRampToValueAtTime(0.14, now + index * 0.055 + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + index * 0.055 + 0.16);
    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start(now + index * 0.055);
    oscillator.stop(now + index * 0.055 + 0.17);
  });
}

export function playFanfare(): void {
  if (muted) return;
  const context = getAudioContext();
  const now = context.currentTime;
  const notes = [523.25, 659.25, 783.99, 1046.5, 987.77, 1046.5];
  notes.forEach((frequency, index) => {
    const start = now + index * 0.105;
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = index < 3 ? 'triangle' : 'sawtooth';
    oscillator.frequency.setValueAtTime(frequency, start);
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(0.09, start + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.18);
    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start(start);
    oscillator.stop(start + 0.2);
  });
}

function getAudioContext(): AudioContext {
  if (!audioContext) {
    audioContext = new AudioContext();
  }
  return audioContext;
}
