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
   * Authentic Maharashtrian Tutari (तुतारी) Brass Fanfare
   * The iconic curved brass horn of Maharashtra heralds Ganapati Bappa's royal aagman
   */
  public playTutari() {
    try {
      const ctx = this.getContext();
      const startTime = ctx.currentTime;

      // Master gain for Tutari
      const tutariMaster = ctx.createGain();
      tutariMaster.gain.setValueAtTime(0.75, startTime);

      // Acoustic horn formant filter simulating the curved brass bell resonance (~1350Hz)
      const hornFilter = ctx.createBiquadFilter();
      hornFilter.type = 'peaking';
      hornFilter.frequency.setValueAtTime(1350, startTime);
      hornFilter.Q.setValueAtTime(2.6, startTime);
      hornFilter.gain.setValueAtTime(7.5, startTime);

      // Warm lowpass filter to remove digital harshness while keeping brilliant brass bite
      const highFilter = ctx.createBiquadFilter();
      highFilter.type = 'lowpass';
      highFilter.frequency.setValueAtTime(4600, startTime);

      hornFilter.connect(highFilter);
      highFilter.connect(tutariMaster);
      tutariMaster.connect(ctx.destination);

      // Helper to synthesize authentic brass horn tone with lip-buzz harmonics and formant dynamics
      const playBrassTone = (
        freq: number,
        start: number,
        dur: number,
        glideFrom?: number,
        hasVibrato = false
      ) => {
        // Oscillator 1: Sawtooth wave for brass buzz & overtone series
        const osc1 = ctx.createOscillator();
        osc1.type = 'sawtooth';

        // Oscillator 2: Triangle wave for horn acoustic body weight
        const osc2 = ctx.createOscillator();
        osc2.type = 'triangle';

        // Gain envelope for the tone
        const noteGain = ctx.createGain();

        // Lip pressure / pitch scheduling
        if (glideFrom) {
          osc1.frequency.setValueAtTime(glideFrom, start);
          osc1.frequency.exponentialRampToValueAtTime(freq, start + 0.16);
          osc2.frequency.setValueAtTime(glideFrom, start);
          osc2.frequency.exponentialRampToValueAtTime(freq * 0.5, start + 0.16);
        } else {
          osc1.frequency.setValueAtTime(freq, start);
          osc2.frequency.setValueAtTime(freq * 0.5, start); // sub-octave warmth
        }

        // Natural lip vibrato on sustained notes (5.6 Hz breath modulation)
        if (hasVibrato) {
          const lfo = ctx.createOscillator();
          const lfoGain = ctx.createGain();
          lfo.frequency.setValueAtTime(5.6, start);
          lfoGain.gain.setValueAtTime(0, start);
          lfoGain.gain.setValueAtTime(0, start + 0.22);
          lfoGain.gain.linearRampToValueAtTime(14, start + 0.55);
          lfo.connect(lfoGain);
          lfoGain.connect(osc1.frequency);
          lfo.start(start);
          lfo.stop(start + dur + 0.2);
        }

        // Brass envelope: sharp tongue attack (0.02s), sustained air pressure, natural decay
        noteGain.gain.setValueAtTime(0.0001, start);
        noteGain.gain.linearRampToValueAtTime(0.38, start + 0.025);
        noteGain.gain.setValueAtTime(0.34, start + dur * 0.72);
        noteGain.gain.exponentialRampToValueAtTime(0.0001, start + dur);

        osc1.connect(noteGain);
        osc2.connect(noteGain);
        noteGain.connect(hornFilter);

        osc1.start(start);
        osc2.start(start);
        osc1.stop(start + dur + 0.05);
        osc2.stop(start + dur + 0.05);
      };

      // The signature Maharashtrian Tutari proclamation:
      // 1. Initial soaring herald call (A4 -> D5)
      playBrassTone(587.33, startTime, 0.48, 392.0); // D5

      // 2. The traditional triplet herald flourish: "Ta - Ta - Ta - Taaaa!"
      const fStart = startTime + 0.58;
      playBrassTone(587.33, fStart, 0.12);        // D5
      playBrassTone(739.99, fStart + 0.14, 0.12); // F#5
      playBrassTone(880.00, fStart + 0.28, 0.14); // A5

      // 3. The Grand Triumphant High Climax Blast (High D6) with sustained vibrato
      const climaxStart = fStart + 0.44;
      playBrassTone(1174.66, climaxStart, 1.85, 880.0, true); // High D6

      // Auspicious temple chime / shimmer at the climax
      const chimeOsc = ctx.createOscillator();
      const chimeGain = ctx.createGain();
      chimeOsc.type = 'sine';
      chimeOsc.frequency.setValueAtTime(2349.32, climaxStart); // D7
      chimeGain.gain.setValueAtTime(0.15, climaxStart);
      chimeGain.gain.exponentialRampToValueAtTime(0.0001, climaxStart + 1.2);
      chimeOsc.connect(chimeGain);
      chimeGain.connect(ctx.destination);
      chimeOsc.start(climaxStart);
      chimeOsc.stop(climaxStart + 1.3);

    } catch (e) {
      console.warn('Tutari audio error', e);
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
