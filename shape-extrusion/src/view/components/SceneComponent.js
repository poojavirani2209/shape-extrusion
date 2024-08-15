import React, { useEffect, useRef } from "react";
import ShapeModel from "../../model/ShapeModel";
import ShapeController from "../../controller/ShapeController";
import * as BABYLON from "babylonjs";
import { RenderingEngine } from "../../controller/RenderingEngineSevice";

export function SceneComponent({ operation, ...rest }) {
  const reactCanvas = useRef(null);
  let renderingEngineRf = useRef(null);
  let sceneRef = useRef(null);
  let extrudedRef = useRef(null);

  useEffect(() => {
    if(!renderingEngineRf.current)
    {
      renderingEngineRf.current = new RenderingEngine();
    }
    renderingEngineRf.current.canvas = reactCanvas.current;
    renderingEngineRf.current.initializeScene();
    console.log(renderingEngineRf.current.engine);
    // window.addEventListener('resize', (renderingEngineRf.resizeEngine));
    return () => {
      // window.removeEventListener('resize', renderingEngineRf.resizeEngine);
      renderingEngineRf.current.disposeEngine();
    };
  }, []);

  useEffect(() => {
    const handlePointerDown = (evt) => {
      let pointClicked = renderingEngineRf.current.getClickedPoint();
      let shapePoints = ShapeController.updateShapePoints(pointClicked);
      renderingEngineRf.current.createLines(shapePoints);
    };

    const handlePointerUp = () => {
      if (operation === "draw") {
        console.log("pointer up");
        ShapeController.finishDrawing();
      }
    };

    if (operation == "draw") {
      // Attach event listeners
      renderingEngineRf.current.canvas.addEventListener("click", handlePointerDown);
      renderingEngineRf.current.canvas.addEventListener("contextmenu", handlePointerUp);
    } else if (operation == "extrude") {
      renderingEngineRf.current.extrudeShape();
    } else if (operation == "move") {
      // Variables for dragging
      let isDragging = false;
      let offset = new BABYLON.Vector3(0, 0, 0);
      let pickInfo = null;

      console.log("move");
      console.log(extrudedRef.current);
      console.log(sceneRef.current);

      // Function to start dragging
      const startDrag = (event) => {
        console.log("drage");
        // Get the mesh that was clicked
        var ray = sceneRef.current.createPickingRay(
          sceneRef.current.pointerX,
          sceneRef.current.pointerY,
          BABYLON.Matrix.Identity()
        );
        var hit = sceneRef.current.pickWithRay(ray);
        console.log(hit.pickedMesh);

        pickInfo = sceneRef.current.pick(
          sceneRef.current.pointerX,
          sceneRef.current.pointerY
        );
        console.log(pickInfo.pickedMesh);
        if (pickInfo.hit && pickInfo.pickedMesh === extrudedRef.current) {
          isDragging = true;
          // Calculate offset
          offset = extrudedRef.current.position.subtract(pickInfo.pickedPoint);
          event.preventDefault(); // Prevent default browser actions
        }
      };

      // Function to drag the mesh
      const drag = (event) => {
        console.log("mousemove");
        if (isDragging && pickInfo) {
          // Update the position based on mouse position
          const newPickInfo = sceneRef.current.pick(
            sceneRef.current.pointerX,
            sceneRef.current.pointerY
          );
          if (newPickInfo.hit) {
            extrudedRef.current.position = newPickInfo.pickedPoint.add(offset);
          }
          event.preventDefault(); // Prevent default browser actions
        }
      };

      // Function to stop dragging
      const stopDrag = (event) => {
        console.log("mouseup");
        isDragging = false;
        pickInfo = null;
        reactCanvas.current.removeEventListener("mousemove", drag);
        event.preventDefault(); // Prevent default browser actions
      };
      reactCanvas.current.removeEventListener("click", handlePointerDown);
      reactCanvas.current.removeEventListener("contextmenu", handlePointerUp);
      reactCanvas.current.addEventListener("click", (event) => {
        console.log("drage start");
        startDrag(event);
      });

      reactCanvas.current.addEventListener("mousemove", drag);
      reactCanvas.current.addEventListener("contextmenu", stopDrag);
    } else {
    //  let ne = React.cloneElement(renderingEngineRf.current);
    //  renderingEngineRf.current = ne;
     return;
    }
  }, [operation]);

  return (
    <canvas
      ref={reactCanvas}
      width={window.innerWidth}
      height={window.innerHeight}
      style={{ position: "absolute", top: "0px", left: "0px" }}
    />
  );
}
