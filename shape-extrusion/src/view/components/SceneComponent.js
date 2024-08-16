import React, { useEffect, useRef } from "react";
import ShapeController from "../../controller/ShapeController";
import * as BABYLON from "babylonjs";
import { RenderingEngine } from "../../controller/RenderingEngineSevice";

export function SceneComponent({ operation }) {
  const reactCanvas = useRef(null);
  let renderingEngineRf = useRef(null);

  const handlePointerDown = () => {
    if (operation == "draw") {
      let pointClicked = renderingEngineRf.current.getClickedPoint();
      let shapePoints = ShapeController.updateShapePoints(pointClicked);
      renderingEngineRf.current.createLines(shapePoints);
    }
  };

  const handlePointerUp = () => {
    if (operation === "draw") {
      ShapeController.finishDrawing();
      reactCanvas.current.removeEventListener("click", handlePointerDown);
      reactCanvas.current.removeEventListener("contextmenu", handlePointerUp);
    }
  };

  useEffect(() => {
    if (!renderingEngineRf.current) {
      renderingEngineRf.current = new RenderingEngine();
    }
    renderingEngineRf.current.canvas = reactCanvas.current;
    renderingEngineRf.current.initializeScene();
    // window.addEventListener('resize', (renderingEngineRf.resizeEngine));
    return () => {
      // window.removeEventListener('resize', renderingEngineRf.resizeEngine);
      renderingEngineRf.current.disposeEngine();
    };
  }, []);

  useEffect(() => {
    switch (operation) {
      case "draw":
        renderingEngineRf.current.canvas.addEventListener(
          "click",
          handlePointerDown
        );
        renderingEngineRf.current.canvas.addEventListener(
          "contextmenu",
          handlePointerUp
        );
        break;
      case "extrude":
        renderingEngineRf.current.extrudeShape(ShapeController.getCurrentShapePoints());
        break;
      case "move":
        // Variables for dragging
        let isDragging = false;
        let offset = new BABYLON.Vector3(0, 0, 0);

        renderingEngineRf.current.scene.onPointerObservable.add((info) => {
          switch (info.type) {
            case BABYLON.PointerEventTypes.POINTERDOWN:
              //("drage start");
              let data = renderingEngineRf.current.startMovingExtrudedShape();
              isDragging = data.isDragging;
              offset = data.offset;
              break;

            case BABYLON.PointerEventTypes.POINTERMOVE:
              isDragging &&
                renderingEngineRf.current.dragExtrudedShape(isDragging, offset);
              break;

            case BABYLON.PointerEventTypes.POINTERUP:
              isDragging = false;
              offset = new BABYLON.Vector3(0, 0, 0);
              break;
          }
        });

        break;
      case "edit":
        let isEditing = false;
        let closestVertex;
        renderingEngineRf.current.scene.onPointerObservable.add((info) => {
          switch (info.type) {
            case BABYLON.PointerEventTypes.POINTERDOWN:
              let data = renderingEngineRf.current.editPoint(ShapeController.getCurrentShapePoints());
              isEditing = data.isEditing;
              closestVertex = data.closestVertex;
              break;

            case BABYLON.PointerEventTypes.POINTERMOVE:
              // if (isEditing) {
              //   renderingEngineRf.current.movePoint(isEditing,closestVertex);
              // }
              break;

            case BABYLON.PointerEventTypes.POINTERUP:
              console.log('up')
              renderingEngineRf.current.updateExtrudedShape();
              isEditing = false;
              closestVertex = undefined;
              break;
          }
        });

        break;
      default:
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
