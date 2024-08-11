import { Engine, Scene } from "@babylonjs/core";
import { useEffect, useRef, useState } from "react";
import ShapeModel from "../../model/ShapeModel";
import ShapeController from "../../controller/ShapeController";
import {
  FreeCamera,
  Vector3,
  HemisphericLight,
  MeshBuilder,
} from "@babylonjs/core";
import * as BABYLON from "babylonjs";

export function SceneComponent({
  antialias,
  engineOptions,
  adaptToDeviceRatio,
  sceneOptions,
  onRender,
  onSceneReady,
  operation,
  ...rest
}) {
  const reactCanvas = useRef(null);
  let [scene,setScene] =useState(null); 
  let extruded=null;

  // set up basic engine and scene
  useEffect(() => {
    const { current: canvas } = reactCanvas;

    if (!canvas) return;

    const engine = new Engine(
      canvas,
      antialias,
      engineOptions,
      adaptToDeviceRatio
    );
    scene = new Scene(engine, sceneOptions);
    scene.clearColor = new BABYLON.Color3(0.5, 0.5, 0.5);

    if (scene.isReady()) {
      onSceneReady(scene);
    } else {
      scene.onReadyObservable.addOnce((scene) => onSceneReady(scene));
    }

    const handlePointerDown = (evt) => {
      const pickResult = scene.pick(scene.pointerX, scene.pointerY);
      if (pickResult.hit) {
        const point = pickResult.pickedPoint;
        if (operation === "draw") {
          console.log("pointer down");
          ShapeController.startDrawing(point);
          MeshBuilder.CreateLines(
            "line",
            { points: ShapeModel.currentShapePoints },
            scene
          );
        } else if (operation === "move") {
          startDrag(evt);
        } else if (operation === "edit") {
          // onVertexEdit(point);
        }
      }
    };

    const handlePointerUp = () => {
      if (operation === "draw") {
        console.log("pointer up");
        ShapeController.finishDrawing();
      }
    };

   
    if (operation == "extrude") {
      console.log("extr");

      var path = [BABYLON.Vector3.Zero(), new BABYLON.Vector3(0, 0, -1)];
      let shape = ShapeModel.currentShape.points;
      
      // var shapeline = BABYLON.Mesh.CreateLines("sl", shape, scene);
      // shapeline.color = BABYLON.Color3.Green();
      
      extruded = BABYLON.Mesh.ExtrudeShape(
        "extruded",
        shape,
        path,
        3,
        5,
        0,
        scene
      );
    }

    // Variables for dragging
    let isDragging = false;
    let offset = new BABYLON.Vector3(0, 0, 0);
    let pickInfo = null;

    // Function to start dragging
    const startDrag = (event) => {
        console.log('drage')
        // Get the mesh that was clicked
        pickInfo = scene.pick(scene.pointerX, scene.pointerY);
        if (pickInfo.hit && pickInfo.pickedMesh === extruded) {
          isDragging = true;
          // Calculate offset
          offset = extruded.position.subtract(pickInfo.pickedPoint);
          event.preventDefault(); // Prevent default browser actions
        }

    };

    // Function to drag the mesh
    const drag = (event) => {
      if (operation == "move") {
        if (isDragging && pickInfo) {
          // Update the position based on mouse position
          const newPickInfo = scene.pick(scene.pointerX, scene.pointerY);
          if (newPickInfo.hit) {
            extruded.position = newPickInfo.pickedPoint.add(offset);
          }
          event.preventDefault(); // Prevent default browser actions
        }
      }
    };

    // Function to stop dragging
    const stopDrag = (event) => {
      if (operation == "move") {
        isDragging = false;
        pickInfo = null;
        event.preventDefault(); // Prevent default browser actions
      }
    };

    // Attach event listeners
    reactCanvas.current.addEventListener("click", handlePointerDown);
    reactCanvas.current.addEventListener("contextmenu", handlePointerUp);
    reactCanvas.current.addEventListener("mousedown", startDrag);
    reactCanvas.current.addEventListener("mousemove", drag);
    reactCanvas.current.addEventListener("mouseup", stopDrag);
    reactCanvas.current.addEventListener("mouseleave", stopDrag); // Stop dragging if mouse leaves the canvas

    engine.runRenderLoop(() => {
      if (typeof onRender === "function") onRender(scene);
      scene.render();
    });

    const resize = () => {
      scene.getEngine().resize();
    };

    if (window) {
      window.addEventListener("resize", resize);
    }

    return () => {
      scene.getEngine().dispose();

      if (window) {
        window.removeEventListener("resize", resize);
      }
    };
  }, [
    antialias,
    engineOptions,
    adaptToDeviceRatio,
    sceneOptions,
    onRender,
    onSceneReady,
    operation
  ]);

  // useEffect(() => {
  //   const handlePointerDown = (evt) => {
  //     const pickResult = scene.pick(scene.pointerX, scene.pointerY);
  //     if (pickResult.hit) {
  //       const point = pickResult.pickedPoint;
  //       if (operation === "draw") {
  //         console.log("pointer down");
  //         ShapeController.startDrawing(point);
  //         MeshBuilder.CreateLines(
  //           "line",
  //           { points: ShapeModel.currentShapePoints },
  //           scene
  //         );
  //       } else if (operation === "move") {
  //         startDrag(evt);
  //       } else if (operation === "edit") {
  //         // onVertexEdit(point);
  //       }
  //     }
  //   };

  //   const handlePointerUp = () => {
  //     if (operation === "draw") {
  //       console.log("pointer up");
  //       ShapeController.finishDrawing();
  //     }
  //   };

   
  //   if (operation == "extrude") {
  //     console.log("extr");

  //     var path = [BABYLON.Vector3.Zero(), new BABYLON.Vector3(0, 0, -1)];
  //     let shape = ShapeModel.currentShape.points;
      
  //     // var shapeline = BABYLON.Mesh.CreateLines("sl", shape, scene);
  //     // shapeline.color = BABYLON.Color3.Green();
      
  //     extruded = BABYLON.Mesh.ExtrudeShape(
  //       "extruded",
  //       shape,
  //       path,
  //       3,
  //       5,
  //       0,
  //       scene
  //     );
  //   }

  //   // Variables for dragging
  //   let isDragging = false;
  //   let offset = new BABYLON.Vector3(0, 0, 0);
  //   let pickInfo = null;

  //   // Function to start dragging
  //   const startDrag = (event) => {
  //       console.log('drage')
  //       // Get the mesh that was clicked
  //       pickInfo = scene.pick(scene.pointerX, scene.pointerY);
  //       if (pickInfo.hit && pickInfo.pickedMesh === extruded) {
  //         isDragging = true;
  //         // Calculate offset
  //         offset = extruded.position.subtract(pickInfo.pickedPoint);
  //         event.preventDefault(); // Prevent default browser actions
  //       }

  //   };

  //   // Function to drag the mesh
  //   const drag = (event) => {
  //     if (operation == "move") {
  //       if (isDragging && pickInfo) {
  //         // Update the position based on mouse position
  //         const newPickInfo = scene.pick(scene.pointerX, scene.pointerY);
  //         if (newPickInfo.hit) {
  //           extruded.position = newPickInfo.pickedPoint.add(offset);
  //         }
  //         event.preventDefault(); // Prevent default browser actions
  //       }
  //     }
  //   };

  //   // Function to stop dragging
  //   const stopDrag = (event) => {
  //     if (operation == "move") {
  //       isDragging = false;
  //       pickInfo = null;
  //       event.preventDefault(); // Prevent default browser actions
  //     }
  //   };

  //   // Attach event listeners
  //   reactCanvas.current.addEventListener("click", handlePointerDown);
  //   reactCanvas.current.addEventListener("contextmenu", handlePointerUp);
  //   reactCanvas.current.addEventListener("mousedown", startDrag);
  //   reactCanvas.current.addEventListener("mousemove", drag);
  //   reactCanvas.current.addEventListener("mouseup", stopDrag);
  //   reactCanvas.current.addEventListener("mouseleave", stopDrag); // Stop dragging if mouse leaves the canvas

  //   return () => {
  //     scene && scene.getEngine().dispose();
  //   };
  // }, [operation]);

  return <canvas ref={reactCanvas} {...rest} />;
}
