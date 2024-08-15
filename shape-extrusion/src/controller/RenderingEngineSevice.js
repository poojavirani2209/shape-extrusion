import {
  FreeCamera,
  Vector3,
  HemisphericLight,
  MeshBuilder,
  Engine,
  Scene,
} from "@babylonjs/core";
import * as BABYLON from "babylonjs";
import ShapeController from "./ShapeController";
import ShapeModel from "../model/ShapeModel";

export class RenderingEngine {
  canvas;
  scene;
  engine;
  extrudedShape;
  camera;

  constructor() {
    this.canvas = null;
    this.scene = null;
    this.engine = null;
    this.extrudedShape = null;
  }

  initializeScene() {
    if (!this.canvas) return; //babylon canvas is not created yet.

    this.engine = new Engine(this.canvas, true);
    this.scene = new Scene(this.engine);
    this.scene.clearColor = new BABYLON.Color3(0.5, 0.5, 0.5);

    if (this.scene.isReady()) {
      this.onSceneReady(this.scene);
    } else {
      this.scene.onReadyObservable.addOnce((scene) => {
        this.scene = scene;
        this.onSceneReady();
      });
    }

    this.engine.runRenderLoop(() => {
      this.scene.render();
    });
  }

  onSceneReady() {
    // This creates and positions a free camera (non-mesh)
    this.camera = new FreeCamera("camera", new Vector3(0, 5, -10), this.scene);
    this.camera.setTarget(Vector3.Zero()); // This targets the camera to scene origin
    this.camera.attachControl(this.canvas, true); // This attaches the camera to the canvas

    this.canvas = this.scene.getEngine().getRenderingCanvas();

    // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
    const light = new HemisphericLight(
      "light",
      new Vector3(0, 1, 0),
      this.scene
    );
    light.intensity = 0.8; // Default intensity is 1. This is done to dim the light

    MeshBuilder.CreateGround("ground", { width: 10, height: 10 }, this.scene);
  }

  resizeEngine() {
    console.log(this.engine);
    this.engine.resize();
  }

  disposeEngine() {
    this.engine.dispose();
  }

  createLines(points) {
    MeshBuilder.CreateLines("line", { points }, this.scene);
  }

  getClickedPoint() {
    const pickResult = this.scene.pick(
      this.scene.pointerX,
      this.scene.pointerY
    );
    if (pickResult.hit) {
      return pickResult.pickedPoint;
    }
    return null;
  }

  extrudeShape() {
    var path = [BABYLON.Vector3.Zero(), new BABYLON.Vector3(0, 0, -1)];
    let shape = ShapeModel.currentShape.points;
    this.extrudedShape = BABYLON.Mesh.ExtrudeShape(
      "extruded",
      shape,
      path,
      3,
      0,
      0,
      this.scene
    );
  }
}
