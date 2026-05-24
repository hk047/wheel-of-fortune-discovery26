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
  playUnlockTap();
}

export function playTick(intensity = 0.6, delaySeconds = 0): void {
  if (muted) return;
  const context = getAudioContext();
  if (context.state === 'suspended') {
    void context.resume();
  }
  const now = context.currentTime + delaySeconds;
  const oscillator = context.createOscillator();
  const body = context.createOscillator();
  const gain = context.createGain();
  const bodyGain = context.createGain();
  const filter = context.createBiquadFilter();

  oscillator.type = 'square';
  oscillator.frequency.setValueAtTime(1250 + intensity * 800, now);
  body.type = 'triangle';
  body.frequency.setValueAtTime(260 + intensity * 120, now);
  filter.type = 'highpass';
  filter.frequency.setValueAtTime(520, now);
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(0.16 * intensity, now + 0.004);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.068);
  bodyGain.gain.setValueAtTime(0.0001, now);
  bodyGain.gain.exponentialRampToValueAtTime(0.055 * intensity, now + 0.005);
  bodyGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.09);

  oscillator.connect(filter);
  filter.connect(gain);
  gain.connect(context.destination);
  body.connect(bodyGain);
  bodyGain.connect(context.destination);
  oscillator.start(now);
  body.start(now);
  oscillator.stop(now + 0.074);
  body.stop(now + 0.096);
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

function playUnlockTap(): void {
  if (muted) return;
  const context = getAudioContext();
  const now = context.currentTime;
  const oscillator = context.createOscillator();
  const gain = context.createGain();

  oscillator.type = 'sine';
  oscillator.frequency.setValueAtTime(520, now);
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(0.035, now + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.055);
  oscillator.connect(gain);
  gain.connect(context.destination);
  oscillator.start(now);
  oscillator.stop(now + 0.06);
}
