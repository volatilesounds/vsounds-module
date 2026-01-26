// src/ui/VSGUI.js
import GUI from "lil-gui";
import { VSStyle } from "./VSStyle";

/**
 * VSGUI
 * -----
 * Thin wrapper around lil-gui with controlled state ownership.
 *
 * IMPORTANT:
 * lil-gui mutates the object properties it is bound to.
 * To avoid giving the GUI direct write access to simulation state,
 * VSGUI uses small proxy objects ({ value }) for each parameter.
 *
 * Flow:
 *   GUI slider → proxy.value → onChange callback → simulation state
 *
 * This guarantees:
 * - GUI never mutates real simulation state directly
 * - All side effects are explicit and centralized
 * - Parameters can later support presets, automation, or external control
 *
 * In short: lil-gui talks to proxies, simulations own the truth.
 */
export class VSGUI {
  constructor({ container, title = null, style = {}, close = false } = {}) {
    this.gui = new GUI({
      title: title,
      autoPlace: false, // so that we can decide where to place it
    });

    // Merge custom styles with defaults
    Object.assign(this.gui.domElement.style, VSStyle.panelBase, style);

    // Hide the GUI title if null
    const titleEl = this.gui.domElement.querySelector(".lil-title");
    if(title === null)
    {
      if (titleEl)
      {
        titleEl.style.display = "none";
      }
    }
    
    // collapse
    if(close)
    {
      this.gui.close();
    }

    container.appendChild(this.gui.domElement);

    this._proxies = {};
  }

  addParams(params, show = true) {
    for (const key in params) {
      this.#addParam(key, params[key]);
    }

    if(show !== undefined)
    {
      this.show(show);
    }
  }

  #addParam(key, config) {
    const { value, min, max, step, label, onChange } = config;
  
    const proxy = { value };
    const controller = this.gui
      .add(proxy, "value", min, max, step)
      .name(label ?? key);
  
    controller.onChange(v => {
      onChange?.(v);
    });
  
    // store both proxy and controller
    this._proxies[key] = { proxy, controller, config };
  }
  
  // reset all
  reset() {
    for (const key in this._proxies) {
      const { proxy, controller, config } = this._proxies[key];
      proxy.value = config.value;        // set proxy to original simulation value
      controller.updateDisplay();        // update slider to reflect new proxy
      config.onChange?.(proxy.value);    // trigger any callback
    }
  }

  show(show) {
    if (!this.gui)
    {
      return;
    }
  
    const isVisible = this.gui.domElement.style.display !== "none";
  
    if (show === undefined) {
      // toggle
      this.gui.domElement.style.display = isVisible ? "none" : "block";
    } else {
      this.gui.domElement.style.display = show ? "block" : "none";
    }
  }
  

  destroy() {
    this.gui.destroy();
    this.gui = null;
  }
}
