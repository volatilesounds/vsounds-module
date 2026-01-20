// src/ui/VSMessageOverlay.js
import { VSStyle } from "./VSStyle";

export class VSMessageOverlay {
  constructor(parentDiv) {
    this.parentDiv = parentDiv;
    this.autoDispose = true; // auto dispose on hide

    this.messageDiv = document.createElement("div");
    Object.assign(this.messageDiv.style, {
      ...VSStyle.panelBase,
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      opacity: "0",
      transition: "opacity 0.5s ease",
      pointerEvents: "none",
      textAlign: "center",
      zIndex: "1000",
      display: "none"
    });

    this.parentDiv.appendChild(this.messageDiv);

    this.timeoutId = null;
  }

  show(text, seconds = 3) {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }

    this.messageDiv.textContent = text;
    this.messageDiv.style.display = "block";

    requestAnimationFrame(() => {
      this.messageDiv.style.opacity = "1";
    });

    if (seconds >= 0) {
      this.timeoutId = setTimeout(() => {
        this.hide();
      }, seconds * 1000);
    }
  }

  /**
   * Hide the overlay
   * @param {boolean} autoDispose - if true, dispose after fade out
   */
  hide() {
    this.messageDiv.style.opacity = "0";

    // Wait for fade-out transition
    setTimeout(() => {
      this.messageDiv.style.display = "none";
      this.timeoutId = null;

      if (this.autoDispose) {
        this.dispose();
      }
    }, 500); // match CSS transition
  }

  dispose() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }

    this.messageDiv.remove();
    this.messageDiv = null;
    this.parentDiv = null;
  }
}
