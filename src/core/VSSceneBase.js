/*
 The VSSceneBase class is a base class for simulation scenes.
 It provides a common interface among different scenes so that they can be easily managed by VSSceneManager.
*/
export class VSSceneBase {
  constructor({ scene, camera, renderer }) {
    this.scene = scene;
    this.camera = camera;
    this.renderer = renderer;
  }

  /** Called once when scene becomes active */
  onEnter() {}

  /** Called once when scene is deactivated */
  onExit() {}

  /** Called every frame */
  update(dt) {}

  /** Optional cleanup */
  dispose() {}
}
