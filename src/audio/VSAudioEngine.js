// src/audio/VSAudioEngine.js
export class VSAudioEngine {
  #enabled = null;
  #onInitCallback = null;
  #audioFadeTimeSeconds = 0.02;

  constructor({ enabled = true, onInit = null } = {}) {
    this.#enabled = enabled;
    this.#onInitCallback = onInit;

    this.audioContext = null;
    this.masterGain = null;
    this.simBus = null; // the bus of the running simulation

     // defer init to first user gesture
     this.#setupInitListener();
  }

  #setupInitListener() {
    const resumeAudio = async () => {
      if (!this.audioContext) {
        this.#initAudioContext();

        if (this.#onInitCallback) {
          this.#onInitCallback(this);
          this.#onInitCallback = null; // fire once
        }
      }

      if (this.audioContext.state === "suspended") {
        await this.audioContext.resume();
      }

      document.removeEventListener("click", resumeAudio);
      document.removeEventListener("keydown", resumeAudio);
    };

    document.addEventListener("click", resumeAudio);
    document.addEventListener("keydown", resumeAudio);
  }

  #initAudioContext() {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      this.masterGain = this.audioContext.createGain();
      this.masterGain.gain.value = this.#enabled ? 1.0 : 0.0;
      this.masterGain.connect(this.audioContext.destination);
    }
  }

  /*
    Helper function to set a gain value over time
  */
  #setGainValue(gain, value) {
    const t = this.audioContext.currentTime;
    gain.cancelScheduledValues(t);
    gain.setTargetAtTime(value, t, this.#audioFadeTimeSeconds);
  }

  isInitialised() {
    return this.audioContext !== null;
  }

  isEnabled() {
    return this.#enabled;
  }

  setAudioEnabled(enabled) {
    this.#enabled = enabled;

    if (this.masterGain) {
      let value = this.#enabled ? 1.0 : 0.0;
      this.#setGainValue(this.masterGain.gain, value);
    }
  }

  pauseSimulationAudio(){
    // Pause simulation audio
    // As now pausing is more like "muting" the simulation audio bus
    if(this.isInitialised() && this.simBus)
    {
      this.#setGainValue(this.simBus.gain, 0);
    }
  }

  resumeSimulationAudio(){
    // Resume simulation audio
    // As now pausing is more like "muting" the simulation audio bus
    if(this.isInitialised() && this.simBus)
    {
      this.#setGainValue(this.simBus.gain, 1);
    }
  }

  /*
    Create simulation bus.
    In so doing the simulation owns all the audio graph it's triggering the sound in
    Resources will be released with the simulation
  */
  createSimBus() {
    if (!this.audioContext || !this.masterGain)
    {
      return null;
    }

    const bus = this.audioContext.createGain();
    bus.gain.value = 0;
    this.#setGainValue(bus.gain, 1);
    bus.connect(this.masterGain);

    this.simBus = bus;

    return bus;
  }

  releaseSimBus(bus) {
    if (!this.audioContext || !bus) {
      return Promise.resolve();
    }

    this.#setGainValue(bus.gain, 0);
  
    // Resolve AFTER fade completes
    return new Promise(resolve => {
      setTimeout(() => {
        try {
          bus.disconnect();
        } catch (e) {
          // already disconnected — safe to ignore
        }
        resolve();
      }, (this.#audioFadeTimeSeconds + 0.1) * 1000);
    });
  }

  /*
    Create an oscillator and a gain node
  */
  createOscillator(type = "sine", frequency = 440, audioBus = null) {
    if (!this.audioContext) return null;
  
    const osc = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
  
    osc.type = type;
    osc.frequency.value = frequency;
    gainNode.gain.value = 0.5;
  
    osc.connect(gainNode);
  
    if (audioBus) {
      gainNode.connect(audioBus);
    } else {
      gainNode.connect(this.masterGain);
    }
  
    osc.start();
  
    return { osc, gainNode };
  }

  dispose() {
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
      this.masterGain = null;
    }
  }
}
