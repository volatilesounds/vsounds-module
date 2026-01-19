import * as THREE from 'three'

/*
 The VSScenesManager class is a utility for managing multiple 3D scenes in a Three.js environment. 
 It handles switching between scenes, updating the current scene, and rendering it with a shared renderer and camera.
*/
export class VSScenesManager {
  constructor(renderer, camera) {
    this.renderer = renderer;
    this.camera = camera;

    this.scene = new THREE.Scene();
    this.clock = new THREE.Clock();

    this.current = null;
  }

  setScene(SceneClass) {
    if (this.current) {
      this.current.onExit();
      this.current.dispose?.();
      this._clearScene();
    }

    this.current = new SceneClass({
      scene: this.scene,
      camera: this.camera,
      renderer: this.renderer
    });

    this.current.onEnter();
  }

  update() {
    const dt = this.clock.getDelta();

    this.current?.update(dt);
    this.renderer.render(this.scene, this.camera);
  }
}
