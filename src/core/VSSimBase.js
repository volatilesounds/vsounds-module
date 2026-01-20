import { VSDebugOverlay } from "../ui/VSDebugOverlay";

/*
 The VSSimBase class is a base class for simulation scenes.
 It provides a common interface among different scenes so that they can be easily managed by VSSimsManager.
*/
export class VSSimBase {
  constructor({ scene, camera, renderer, container, audioEngine }) {
    this.scene = scene;
    this.camera = camera;
    this.renderer = renderer;
    this.container = container;
    this.audioEngine = audioEngine;

    this.audioBus = null;
    this.audioBusGainPaused = 1;

    this.debugOverlay = new VSDebugOverlay(container); // Debug draw

    // Enforcing final functions
    if (this.onAudioEngineInit !== VSSimBase.prototype.onAudioEngineInit) {
      throw new Error("onAudioEngineInit must not be overridden - override onAudioStart");
    }
    if (this.onAudioEngineShutdown !== VSSimBase.prototype.onAudioEngineShutdown) {
      throw new Error("onAudioEngineShutdown must not be overridden - override onAudioStop");
    }
  }

  /** Called once when sim becomes active */
  onEnter() {

  }

  /** Called once when sim is deactivated */
  onExit() {
  
  }

  /** Called when sim is paused */
  onPause() {
  
  }

  /** Called when sim is resumed */
  onResume() {

  }

  /** Called at the start of simulation or when audio engine is initialised (if simulation was already active) */
  onAudioStart() {
  
  }

  /** Called when stopping the simulation */
  onAudioStop() {
    
  }

  /** Called when audio enigne is initialised */
  onAudioEngineInit() {
    this.audioBus = this.audioEngine.createSimBus();
    this.onAudioStart();
  }

  /** Called when audio enigne is shut down or when exiting a simulation */
  onAudioEngineShutdown() {
    if (this.audioBus) {
      this.audioBus.disconnect();
      this.audioBus = null;
    }
    this.onAudioStop();
  }

  /** Called every frame */
  update(dt) {}

  /** Optional cleanup */
  dispose() {
    this.debugOverlay?.dispose();
    this.debugOverlay = null;
  }
}