import { VSStyle } from "./VSStyle";
import { VSGUI } from '../ui/VSGUI';

export class VSSettingsOverlay {
  constructor(container, { onToggleAudio, onTogglePlay, onRestart } = {}) {
    this.onToggleAudio = onToggleAudio;
    this.onTogglePlay = onTogglePlay;
    this.onRestart = onRestart;

    // Main container
    this.mainDiv = document.createElement("div");
    Object.assign(this.mainDiv.style, {
      ...VSStyle.panelBase,
      position: "absolute",
      bottom: VSStyle.sizing.edgeLarge,
      right: VSStyle.sizing.edgeLarge,
      display: "flex",
      flexDirection: "column",
      gap: VSStyle.sizing.spacingMedium,
      border: "1px solid rgba(255,255,255,0.2)",
      borderRadius: "4px",
      pointerEvents: "auto"
    });

    container.appendChild(this.mainDiv);

    const buttonsDiv = document.createElement("div");
    Object.assign(buttonsDiv.style, {
      position: "relative",
      display: "flex",
      gap: VSStyle.sizing.spacingMedium
    });
    this.mainDiv.appendChild(buttonsDiv);

    // Buttons
    this.audioBtn = this.#createButton("Audio: OFF");
    this.playBtn = this.#createButton("Pause");
    this.restartBtn = this.#createButton("Restart");
    this.controlsBtn = this.#createButton("Controls");

    // Click handlers
    this.audioBtn.onclick = () => this.onToggleAudio?.();
    this.playBtn.onclick = () => this.onTogglePlay?.();
    this.restartBtn.onclick = () => this.#restart();
    this.controlsBtn.onclick = () => this.#showControls();

    buttonsDiv.append(this.controlsBtn, this.audioBtn, this.playBtn, this.restartBtn);

    // Settings overlay owns a gui to control global simulation params
    this.guiContainer = document.createElement("div");
    Object.assign(this.guiContainer.style, {
      display: "none"
    });
    this.mainDiv.appendChild(this.guiContainer);

    // Add settings gui for global param control
    this.gui = new VSGUI({ 
      container : this.guiContainer,
      style: {
        ...VSStyle.buttonBase,
        minWidth: "100%",
        maxWidth: "100%"
      }
    });
  }

  // Update labels based on simulation state
  setAudioEnabledLabel(isEnabled) {
    this.audioBtn.textContent = isEnabled ? "Audio: ON" : "Audio: OFF";
  }

  setRunningLabel(isRunning) {
    this.playBtn.textContent = isRunning ? "Pause" : "Resume";
  }

  #createButton(label = "") {
    const btn = document.createElement("button");
    btn.textContent = label;
    Object.assign(btn.style, VSStyle.buttonBase);
    btn.style.outline = "none";
    return btn;
  }

  #restart() {
    const confirmed = window.confirm("Restart simulation?");
    if (confirmed) this.onRestart?.();
  }

  #showControls() {
    const isHidden = this.guiContainer.style.display === "none";
    this.guiContainer.style.display = isHidden ? "block" : "none";
  }
}
