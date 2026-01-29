import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { VSDebugOverlay } from "../ui/VSDebugOverlay";
import { VSSettingsOverlay } from "../ui/VSSettingsOverlay";
import { VSAudioEngine } from '../audio/VSAudioEngine';
import { VSMessageOverlay } from '../ui/VSMessageOverlay';
import { injectVSoundsStyle } from '../ui/VSStyleInject';

/*
 The VSSimsManager class is a utility for managing multiple simulations. 
 It handles switching between scenes, updating the current scene, and rendering it with a shared renderer and camera.
*/
export class VSSimsManager {
  constructor(renderer, camera, container) {
    injectVSoundsStyle(); // global VSounds styles

    this.renderer = renderer;
    this.camera = camera;
    this.container = container;
    this.audioEngine = new VSAudioEngine({enabled: true, onInit: () => this.onAudioEngineInit()}); // audio engine

    this.scene = new THREE.Scene();
    this.clock = new THREE.Clock();

    this.currentSim = null;
    this.currentSimClass = null;

    // Create orbit controls
    this.orbitControls = new OrbitControls(camera, renderer.domElement)
    this.orbitControls.enableDamping = true
    this.orbitControls.enabled = false

    // State
    this.paused = false;
    this.audioEnabled = this.audioEngine?.isEnabled() ?? true;

    // Overlay
    this.debugOverlay = new VSDebugOverlay(container);

    this.settingsOverlay = new VSSettingsOverlay(container, {
      onToggleAudio: () => this.toggleAudio(),
      onTogglePlay: () => this.togglePause(),
      onRestart: () => this.restartSimulation()
    });
    this.settingsOverlay.setAudioEnabledLabel(this.audioEnabled);
    this.settingsOverlay.setRunningLabel(!this.paused);

    this.messageOverlay = new VSMessageOverlay(container);
    this.messageOverlay.autoDispose = false; // prevent from being automatically disposed when hiding

    // Show warning message that audio is not enabled by default
    this.messageOverlay.show(
      "Audio will start automatically after a click or key press.",
      3
    );

    // Add here params to be shown in settings overlay controls view
    this.simSpeed = 1.;
    this.enabledOrbitControls = false;

    this.settingsOverlay.gui.addParams({
      orbit: {
        type: "boolean",
        value: this.enabledOrbitControls,
        label: "Orbit Controls",
        onChange: v => {this.orbitControls.enabled = v}
      },
      speed: {
        value: this.simSpeed,
        min: 0,
        max: 2,
        step: 0.01,
        label: "Time Dilation",
        onChange: v => this.simSpeed = v
      }
    });
  }

  toggleAudio() {
    this.audioEnabled = !this.audioEnabled;
    this.audioEngine?.setAudioEnabled(this.audioEnabled);
    this.settingsOverlay.setAudioEnabledLabel(this.audioEnabled);
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

    this.settingsOverlay.setRunningLabel(!this.paused);
  }

  onAudioEngineInit() {
    if (this.currentSim) {
      this.currentSim.onAudioEngineInit?.();

      // As audio engine init might be called after the simulation has been paused
      if(this.paused)
      {
        this.audioEngine.pauseSimulationAudio();
      }
    }
  }

  restartSimulation() {
    if (!this.currentSim || !this.currentSimClass) {
      return;
    }

    this.setSimulation(this.currentSimClass);
  }

  pauseSimulation() {
    if (!this.currentSim) {
      return;
    }

    this.paused = true;

    this.audioEngine.pauseSimulationAudio();

    this.currentSim.onPause?.();
  }

  resumeSimulation() {
    if (!this.currentSim) {
      return;
    }

    this.paused = false;
    this.clock.getDelta(); // reset delta spike

    this.audioEngine.resumeSimulationAudio();

    this.currentSim.onResume?.();
  }

  async setSimulation(SimClass) {
    if (this.currentSim) {
      await this.currentSim.onAudioEngineShutdown();
      this.currentSim.onExit();
      this.currentSim.dispose?.();
      this._clearSim();
    }

    this.currentSimClass = SimClass;

    this.currentSim = new SimClass({
      scene: this.scene,
      camera: this.camera,
      renderer: this.renderer,
      container: this.settingsOverlay.guiContainer,
      debugOverlay: this.debugOverlay,
      audioEngine: this.audioEngine
    });

    this.currentSim.onEnter();
    if(this.audioEngine.isInitialised())
    {
      this.currentSim.onAudioEngineInit?.();
    }
    
    if(this.paused)
    {
      this.togglePause();
    }

    // reset global param
    this.resetGlobalParams();

    // reset orbit controls and save camera states
    // we could save the state of controls that get reset with saveState
    this.orbitControls.reset();
  }

  resetGlobalParams() {
    this.settingsOverlay.gui.reset();
  }

  update() {
    if (!this.currentSim)
    {
      return;
    }

    let dt = this.clock.getDelta();

    // Apply global simulation speed
    dt *= this.simSpeed;

    if (!this.paused) {
      this.currentSim.update(dt);
    }

    this.renderer.render(this.scene, this.camera);
  }

  _clearSim() {
    while (this.scene.children.length > 0) {
      this.scene.remove(this.scene.children[0]);
    }
  }
}
