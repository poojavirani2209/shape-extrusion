import { useState } from "react";
import "./App.css";
import { OperationComponent } from "./view/components/OperationComponent";
import { SceneComponent } from "./view/components/SceneComponent";

import {
  FreeCamera,
  Vector3,
  HemisphericLight,
  MeshBuilder,
} from "@babylonjs/core";
import ShapeController from "./controller/ShapeController";
import ShapeModel from "./model/ShapeModel";

const onSceneReady = (scene) => {
  // This creates and positions a free camera (non-mesh)
  const camera = new FreeCamera("camera1", new Vector3(0, 5, -10), scene);

  // This targets the camera to scene origin
  camera.setTarget(Vector3.Zero());

  const canvas = scene.getEngine().getRenderingCanvas();

  // This attaches the camera to the canvas
  camera.attachControl(canvas, true);

  // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
  const light = new HemisphericLight("light", new Vector3(0, 1, 0), scene);

  // Default intensity is 1. Let's dim the light a small amount
  light.intensity = 0.7;

  // Our built-in 'ground' shape.
  MeshBuilder.CreateGround("ground", { width: 6, height: 6 }, scene);
};

/**
 * Will run on every frame render.  We are spinning the box on y-axis.
 */
const onRender = (scene) => {};

const handleExtrude = () => {
  console.log("extrude");
};

function App() {
  let [operation, setOperation] = useState("draw");
  return (
    <>
      <div style={{ position: "absolute", top: 0, left: 0, padding: "10px" }}>
        <button onClick={() => setOperation("draw")}>Draw</button>
        <button onClick={() => setOperation("extrude")}>Extrude</button>
        <button onClick={() => setOperation("move")}>Move</button>
        <button onClick={() => setOperation("edit")}>Edit Vertices</button>
      </div>
      <SceneComponent
        antialias
        onSceneReady={onSceneReady}
        onRender={onRender}
        operation={operation}
        id="my-canvas"
      />
    </>
  );
}

export default App;
