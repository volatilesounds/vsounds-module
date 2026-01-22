import * as THREE from 'three'
import { VSButtonsOverlay } from "../ui/VSButtonsOverlay";
import { VSAudioEngine } from '../audio/VSAudioEngine';
import { VSMessageOverlay } from '../ui/VSMessageOverlay';

/*
 The VSSimsManager class is a utility for managing multiple simulations. 
 It handles switching between scenes, updating the current scene, and rendering it with a shared renderer and camera.
*/
export class VSSimsManager {
  constructor(renderer, camera, container) {
    this.renderer = renderer;
    this.camera = camera;
    this.container = container;
    this.audioEngine = new VSAudioEngine({enabled: true, onInit: () => this.onAudioEngineInit()}); // audio engine

    this.scene = new THREE.Scene();
    this.clock = new THREE.Clock();

    this.current = null;
    this.currentSimClass = null;

    // State
    this.paused = false;
    this.audioEnabled = this.audioEngine?.isEnabled() ?? true;

    // Overlay
    this.buttonsOverlay = new VSButtonsOverlay(container, {
      onToggleAudio: () => this.toggleAudio(),
      onTogglePlay: () => this.togglePause(),
      onRestart: () => this.restartSimulation()
    });
    this.buttonsOverlay.setAudioEnabledLabel(this.audioEnabled);
    this.buttonsOverlay.setRunningLabel(!this.paused);

    this.messageOverlay = new VSMessageOverlay(container);
    this.messageOverlay.autoDispose = false; // prevent from being automatically disposed when hiding

    // Show warning message that audio is not enabled by default
    this.messageOverlay.show(
      "Audio will start automatically after a click or key press.",
      3
    );
  }

  toggleAudio() {
    this.audioEnabled = !this.audioEnabled;
    this.audioEngine?.setEnabled(this.audioEnabled);
    this.buttonsOverlay.setAudioEnabledLabel(this.audioEnabled);
  }

  togglePause() {
    this.paused = !this.paused;
    if (this.paused){
      this.messageOverlay.show(
        "Simulation paused.",
        -1
      );
      this.pauseSimulation();
    } else {
      this.messageOverlay.hide();
      this.resumeSimulation();
    }

    this.buttonsOverlay.setRunningLabel(!this.paused);
  }

  onAudioEngineInit() {
    if (this.current) {
      this.current.onAudioEngineInit?.();

      // As audio engine init might be called after the simulation has been paused
      if(this.paused)
      {
        this.pauseSimulationAudio();
      }
    }
  }

  restartSimulation() {
    if (!this.current || !this.currentSimClass) {
      return;
    }

    this.setSimulation(this.currentSimClass);
  }

  pauseSimulation() {
    if (!this.current) {
      return;
    }

    this.paused = true;

    this.pauseSimulationAudio();

    this.current.onPause?.();
  }

  resumeSimulation() {
    if (!this.current) {
      return;
    }

    this.paused = false;
    this.clock.getDelta(); // reset delta spike

    this.resumeSimulationAudio();

    this.current.onResume?.();
  }

  setSimulation(SimClass) {
    if (this.current) {
      this.current.onExit();
      this.current.onAudioEngineShutdown();
      this.current.dispose?.();
      this._clearSim();
    }

    this.currentSimClass = SimClass;

    this.current = new SimClass({
      scene: this.scene,
      camera: this.camera,
      renderer: this.renderer,
      container: this.container,
      audioEngine: this.audioEngine
    });

    this.current.onEnter();
    if(this.audioEngine.isInitialised())
    {
      this.current.onAudioEngineInit?.();
    }
    
    if(this.paused)
    {
      this.togglePause();
    }
  }

  pauseSimulationAudio(){
    // Pause simulation audio
    // As now pausing is more like "muting" the simulation audio bus
    if(this.audioEngine.isInitialised() && this.current.audioBus)
    {
      this.current.audioBus.gain.setValueAtTime(
        0,
        this.audioEngine.audioContext.currentTime
      );
    }
  }

  resumeSimulationAudio(){
    // Resume simulation audio
    // As now pausing is more like "muting" the simulation audio bus
    if(this.audioEngine.isInitialised() && this.current.audioBus)
    {
      this.current.audioBus.gain.setValueAtTime(
        1,
        this.audioEngine.audioContext.currentTime
      );
    }
  }

  update() {
    if (!this.current) return;

    const dt = this.clock.getDelta();

    if (!this.paused) {
      this.current.update(dt);
    }

    this.renderer.render(this.scene, this.camera);
  }

  _clearSim() {
    while (this.scene.children.length > 0) {
      this.scene.remove(this.scene.children[0]);
    }
  }
}
