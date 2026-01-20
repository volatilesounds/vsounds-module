import { VSStyle } from "./VSStyle";

export class VSDebugOverlay {
  constructor(parentDiv) {
    this.enabled = false;
    this.debugData = new Map(); // Stores categories and their debug info

    this.debugDiv = document.createElement("div");
    Object.assign(this.debugDiv.style, {
      ...VSStyle.panelBase,
      top: VSStyle.spacing.edgeMedium,
      left: VSStyle.spacing.edgeMedium,
      whiteSpace: 'pre-line',
      display: 'none' // Initially hidden
    })

    parentDiv.appendChild(this.debugDiv);

    // Listen for key press to toggle debug mode
    document.addEventListener("keydown", (event) => {
      if (event.key === "'") { // Press F1 to toggle debug info
        this.enabled = !this.enabled;
        if(this.debugDiv)
        {
          this.debugDiv.style.display = this.enabled ? "block" : "none";
        }
      }
    });
  }

  /**
   * Adds a new debug category.
   * @param {string} category - The name of the debug category.
   */
  addDebugCategory(category) {
    if (!this.debugData.has(category)) {
      this.debugData.set(category, []);
    }
  }

  /**
   * Adds debug text under a specific category.
   * @param {string} category - The debug category.
   * @param {string} label - The debug label.
   * @param {string|number} value - The value to display.
   */
  addTextCategory(category, label, value) {
    if (!this.enabled) {
      return;
    }

    if (!this.debugData.has(category)) {
      this.addDebugCategory(category);
    }

    this.debugData.get(category).push(`${label}: ${value}`);
  }

  /**
   * Adds a debug text without specifying a category.
   * @param {string} label - The debug label.
   * @param {string|number} value - The value to display.
   */
  addText(label, value) {
    this.addTextCategory("Default", label, value);
  }

  /**
   * Updates and displays the debug information.
   */
  update() {
    let debugText = `<strong>Debug Info</strong>\n`;

    // Draw debug data
    if (this.enabled) {
      this.debugData.forEach((entries, category) => {
        debugText += `\n<strong>${category}</strong>\n${entries.join("\n")}\n`;
      });
      
      // Reset debug data for the next frame
      this.debugData.clear();
    }

    this.debugDiv.innerHTML = debugText;
  }

  /**
   * Clean up resources and events
   */
  dispose() {
    // Remove DOM element
    this.debugDiv?.remove();
    this.debugDiv = null;

    // Remove event listener
    document.removeEventListener("keydown", this._onKeyDown);
    this._onKeyDown = null;

    // Clear data
    this.debugData.clear();
  }
}

