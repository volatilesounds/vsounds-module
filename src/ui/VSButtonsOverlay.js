import { VSStyle } from "./VSStyle";

export class VSButtonsOverlay {
  constructor(parentDiv, { onToggleAudio, onTogglePlay, onRestart } = {}) {
    this.onToggleAudio = onToggleAudio;
    this.onTogglePlay = onTogglePlay;
    this.onRestart = onRestart;

    // Main container
    this.buttonsDiv = document.createElement("div");
    Object.assign(this.buttonsDiv.style, {
      ...VSStyle.panelBase,
      top: VSStyle.spacing.edgeMedium,
      right: VSStyle.spacing.edgeMedium,
      display: 'flex',
      gap: '8px',
      zIndex: 1000,
      border: "1px solid rgba(255,255,255,0.2)",
      borderRadius: "4px",
      pointerEvents: "auto"
    });

    // Buttons
    this.audioBtn = this.#createButton("Audio: OFF");
    this.playBtn = this.#createButton("Pause");
    this.restartBtn = this.#createButton("Restart");

    // Click handlers
    this.audioBtn.onclick = () => this.onToggleAudio?.();
    this.playBtn.onclick = () => this.onTogglePlay?.();
    this.restartBtn.onclick = () => this.#openSettings();

    this.buttonsDiv.append(this.audioBtn, this.playBtn, this.restartBtn);
    parentDiv.appendChild(this.buttonsDiv);
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

  #openSettings() {
    const confirmed = window.confirm("Restart simulation?");
    if (confirmed) this.onRestart?.();
  }
}
