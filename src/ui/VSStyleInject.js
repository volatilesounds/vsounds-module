// src/ui/VSStyleInject.js
import { VSStyle } from "./VSStyle";

/**
 * Injects global VSounds styling for GUIs, sliders, buttons, and overlays.
 * Can be called once when initializing the app or simulation manager.
 */
export function injectVSoundsStyle() {
  // Prevent injecting multiple times
  if (document.getElementById("vsounds-style"))
  {
    return;
  }

  const style = document.createElement("style");
  style.id = "vsounds-style";
  style.textContent = `
    /* 
      Lil Gui overrides
      The full list is included, even variables which are overridden
    */
    .lil-gui {
      font-family: var(--font-family);
      font-size: var(--font-size);
      line-height: 1;
      font-weight: normal;
      font-style: normal;
      text-align: left;
      color: var(--text-color);
      user-select: none;
      -webkit-user-select: none;
      touch-action: manipulation;
      --background-color: ${VSStyle.colors.overlay};
      --text-color: ${VSStyle.colors.text};
      --title-background-color: ${VSStyle.colors.overlay};
      --title-text-color: ${VSStyle.colors.text};
      --widget-color: #424242;
      --hover-color: #4f4f4f;
      --focus-color: #595959;
      --number-color: ${VSStyle.colors.text};
      --string-color: ${VSStyle.colors.text};
      --font-size: 11px;
      --input-font-size: 11px;
      --font-family: ${VSStyle.typography.fontFamily};
      --font-family-mono: ${VSStyle.typography.fontFamily};
      --padding: ${VSStyle.sizing.paddingSmall};
      --spacing: ${VSStyle.sizing.spacingMedium};
      --widget-height: 20px;
      --title-height: calc(var(--widget-height) + var(--spacing) * 1.25);
      --name-width: 45%;
      --slider-knob-width: 2px;
      --slider-input-width: 27%;
      --color-input-width: 27%;
      --slider-input-min-width: 45px;
      --color-input-min-width: 45px;
      --folder-indent: 7px;
      --widget-padding: 0 0 0 3px;
      --widget-border-radius: 2px;
      --checkbox-size: calc(0.75 * var(--widget-height));
      --scrollbar-width: 5px;
    }
  `;
  document.head.appendChild(style);
}
