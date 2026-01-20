// src/audio/VSAudioEngine.js
export class VSAudioEngine {
  #enabled = null;
  #onInitCallback = null;

  constructor({ enabled = true, onInit = null } = {}) {
    this.#enabled = enabled;
    this.#onInitCallback = onInit;

    this.audioContext = null;
    this.masterGain = null;

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

  isInitialised() {
    return this.audioContext !== null;
  }

  isEnabled() {
    return this.#enabled;
  }

  setEnabled(enabled) {
    this.#enabled = enabled;

    if (this.masterGain) {
      this.masterGain.gain.value = this.#enabled ? 1.0 : 0.0;
    }
  }

  /*
    Create simulation bus - owned by the simulation.
    In so doing the simulation owns all the audio graph it's triggering the sound in
    Resources will be released with the simulation
  */
  createSimBus() {
    if (!this.audioContext || !this.masterGain)
    {
      return null;
    }

    const sceneGain = this.audioContext.createGain();
    sceneGain.gain.value = 1.0;
    sceneGain.connect(this.masterGain);

    return sceneGain;
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
