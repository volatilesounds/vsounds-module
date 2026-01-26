import { VSGUI } from "../ui/VSGUI";
import { VSStyle } from "../ui/VSStyle";

/*
 The VSSimBase class is a base class for simulation scenes.
 It provides a common interface among different scenes so that they can be easily managed by VSSimsManager.
*/
export class VSSimBase {
  constructor({ scene, camera, renderer, container, audioEngine, debugOverlay, title = "Simulation", description = "This is a simulation." }) {
    // Enforcing final functions
    if (this.onAudioEngineInit !== VSSimBase.prototype.onAudioEngineInit) {
      throw new Error("onAudioEngineInit must not be overridden - override onAudioStart");
    }
    if (this.onAudioEngineShutdown !== VSSimBase.prototype.onAudioEngineShutdown) {
      throw new Error("onAudioEngineShutdown must not be overridden - override onAudioStop");
    }
    
    this.scene = scene;
    this.camera = camera;
    this.renderer = renderer;
    this.container = container;
    this.audioEngine = audioEngine;

    this.audioBus = null;

    this.debugOverlay = debugOverlay; // Debug draw
    this.gui = new VSGUI({ 
      container, 
      title: title,
      close: true,
      style: {
        ...VSStyle.panelBase,
        width: "100%"
      }
    }); // GUI

    // We don't show the GUI by default
    this.showParams(false);
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

  /** Called when audio engine is shut down or when exiting a simulation */
  async onAudioEngineShutdown() {
    if (this.audioBus) {
      await this.audioEngine.releaseSimBus(this.audioBus);
      this.audioBus = null;
    }
    this.onAudioStop();
  }

  /* Called to show simulation params */
  showParams(show){
    this.gui.show(show);
  }

  /** Called every frame */
  update(dt) {}

  /** Optional cleanup */
  dispose() {
    this.debugOverlay?.dispose();
    this.debugOverlay = null;
    
    this.gui?.destroy();
    this.gui = null;
  }
}