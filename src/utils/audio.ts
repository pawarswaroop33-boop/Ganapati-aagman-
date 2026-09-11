/**
 * Web Audio API synthesized sounds for authentic temple ambiance
 * without needing external MP3 dependencies that could fail or get blocked by CORS.
 */

class TempleAudioEngine {
  private ctx: AudioContext | null = null;
  private ambientGain: GainNode | null = null;
  private isAmbientRunning = false;
  private ambientOscillators: OscillatorNode[] = [];
  private ambientInterval: number | null = null;

  private getContext(): AudioContext {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  /**
   * Resonant brass temple bell with authentic overtones and long decay
   */
  public ringBell() {
    try {
      const ctx = this.getContext();
      const now = ctx.currentTime;

      // Pure bell harmonic series
      const frequencies = [587.33, 880, 1174.66, 1760, 2349.32]; // D5, A5, D6, A6, D7
      const amplitudes = [0.45, 0.3, 0.2, 0.1, 0.05];
      const decays = [3.2, 2.6, 2.0, 1.4, 0.9];

      frequencies.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = idx === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, now);

        gain.gain.setValueAtTime(amplitudes[idx] * 0.35, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + decays[idx]);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + decays[idx] + 0.1);
      });
    } catch (e) {
      console.warn('Audio play error', e);
    }
  }

  /**
   * Deep spiritual Shankhnad (conch shell sound)
   */
  public soundShankh() {
    try {
      const ctx = this.getContext();
      const now = ctx.currentTime;
      const duration = 2.8;

      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const filter = ctx.createBiquadFilter();
      const gain = ctx.createGain();

      osc1.type = 'sawtooth';
      osc2.type = 'sine';

      // Pitch sweep characteristic of a shankh blow
      osc1.frequency.setValueAtTime(220, now);
      osc1.frequency.linearRampToValueAtTime(330, now + 0.5);
      osc1.frequency.linearRampToValueAtTime(310, now + duration);

      osc2.frequency.setValueAtTime(440, now);
      osc2.frequency.linearRampToValueAtTime(660, now + 0.5);
      osc2.frequency.linearRampToValueAtTime(620, now + duration);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(800, now);
      filter.frequency.linearRampToValueAtTime(1400, now + 0.6);
      filter.frequency.linearRampToValueAtTime(600, now + duration);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.25, now + 0.4);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      osc1.connect(filter);
      osc2.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + duration);
      osc2.stop(now + duration);
    } catch (e) {
      console.warn('Audio play error', e);
    }
  }

  /**
   * Soothing meditative Tanpura & devotional drone
   */
  public startDevotionalAmbient() {
    if (this.isAmbientRunning) return;
    try {
      const ctx = this.getContext();
      this.isAmbientRunning = true;

      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0.12, ctx.currentTime);
      masterGain.connect(ctx.destination);
      this.ambientGain = masterGain;

      // Base Tanpura strings (Pa - Sa - Sa - Sa in D: A3, D4, D4, D3)
      const baseFreqs = [220, 293.66, 293.66, 146.83];
      this.ambientOscillators = [];

      baseFreqs.forEach((f, i) => {
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(f, ctx.currentTime);

        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 450;

        g.gain.setValueAtTime(0.05 + i * 0.02, ctx.currentTime);

        osc.connect(filter);
        filter.connect(g);
        g.connect(masterGain);

        osc.start();
        this.ambientOscillators.push(osc);
      });

      // Periodic gentle chime note like an Indian flute/santoor phrase
      const ragaNotes = [293.66, 329.63, 369.99, 440, 493.88, 587.33]; // D Major / Yaman scale
      this.ambientInterval = window.setInterval(() => {
        if (!this.isAmbientRunning || !this.ctx) return;
        const note = ragaNotes[Math.floor(Math.random() * ragaNotes.length)];
        const o = this.ctx.createOscillator();
        const g = this.ctx.createGain();

        o.type = 'sine';
        o.frequency.setValueAtTime(note, this.ctx.currentTime);

        g.gain.setValueAtTime(0.0001, this.ctx.currentTime);
        g.gain.linearRampToValueAtTime(0.06, this.ctx.currentTime + 0.3);
        g.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 2.5);

        o.connect(g);
        g.connect(masterGain);
        o.start();
        o.stop(this.ctx.currentTime + 2.6);
      }, 2200);

    } catch (e) {
      console.warn('Devotional ambient start error', e);
    }
  }

  public stopDevotionalAmbient() {
    this.isAmbientRunning = false;
    if (this.ambientInterval) {
      clearInterval(this.ambientInterval);
      this.ambientInterval = null;
    }
    if (this.ambientGain && this.ctx) {
      try {
        this.ambientGain.gain.linearRampToValueAtTime(0.0001, this.ctx.currentTime + 0.5);
        setTimeout(() => {
          this.ambientOscillators.forEach(o => {
            try { o.stop(); o.disconnect(); } catch {}
          });
          this.ambientOscillators = [];
        }, 600);
      } catch {}
    }
  }

  public isAmbientActive(): boolean {
    return this.isAmbientRunning;
  }
}

export const templeAudio = new TempleAudioEngine();
