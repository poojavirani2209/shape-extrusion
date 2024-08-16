import React, { useEffect, useRef } from "react";
import ShapeController from "../../controller/ShapeController";
import * as BABYLON from "babylonjs";
import { RenderingEngine } from "../../controller/RenderingEngineSevice";

export function SceneComponent({ operation }) {
  const reactCanvas = useRef(null);
  let renderingEngineRf = useRef(null);

  useEffect(() => {
    try {
      if (!renderingEngineRf.current) {
        renderingEngineRf.current = new RenderingEngine();
      }
      renderingEngineRf.current.canvas = reactCanvas.current;
      renderingEngineRf.current.initializeScene();
      return () => {
        renderingEngineRf.current.disposeEngine();
      };
    } catch (error) {
      console.log(`Error occurred while initializing scene.`, error);
    }
  }, []);

  useEffect(() => {
    try {
      switch (operation) {
        case "draw":
          renderingEngineRf.current.scene.onPointerObservable.add((info) => {
            switch (info.type) {
              case BABYLON.PointerEventTypes.POINTERDOWN:
                if (isRightClick(info)) {
                  ShapeController.finishDrawing();
                } else if (isLeftClick(info)) {
                  let pointClicked =
                    renderingEngineRf.current.getClickedPoint();
                  let shapePoints =
                    ShapeController.updateShapePoints(pointClicked);
                  renderingEngineRf.current.createLines(shapePoints);
                }

                // reactCanvas.addEventListener('contextmenu', (e) => e.preventDefault());
                break;
            }
          });
          break;
        case "extrude":
          renderingEngineRf.current.extrudeShape(
            ShapeController.getCurrentShapePoints()
          );
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
                  renderingEngineRf.current.dragExtrudedShape(
                    isDragging,
                    offset
                  );
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
                let data = renderingEngineRf.current.editPoint();
                isEditing = data.isEditing;
                closestVertex = data.vertexToBeMoved;
                break;

              case BABYLON.PointerEventTypes.POINTERMOVE:
                if (isEditing) {
                  closestVertex = renderingEngineRf.current.movePoint(
                    isEditing,
                    closestVertex
                  );
                }
                break;

              case BABYLON.PointerEventTypes.POINTERUP:
                console.log("up");
                renderingEngineRf.current.updateExtrudedShape();
                isEditing = false;
                closestVertex = undefined;
                break;
            }
          });

          break;
        default:
          renderingEngineRf.current.scene.onPointerObservable.clear();

          return;
      }
    } catch (error) {
      console.log(
        `Error occurred while performing operation ${operation}`,
        error
      );
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

  function isLeftClick(info) {
    return info.event.button == 1;
  }

  function isRightClick(info) {
    return info.event.button == 2;
  }
}
