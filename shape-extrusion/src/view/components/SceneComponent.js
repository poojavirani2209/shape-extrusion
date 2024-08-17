import React, { useEffect, useRef, useState } from "react";
import ShapeController from "../../controller/ShapeController";
import * as BABYLON from "babylonjs";
import { RenderingEngine } from "../../controller/RenderingEngineSevice";

/**
 * Component responsible for viewing the scene and canvas where use can interact and perform provided operations.
 * @returns
 */
export function SceneComponent({ operation }) {
  const reactCanvas = useRef(null);

  //useRef allows to persist mutable values between renders without re-renders.
  // Here we need the rendering engine while initialization and performing operations in scene.
  let renderingEngineRf = useRef(null);

  const [refresh, setRefresh] = useState(false);
  const [error, setError] = useState(null);

  //Initialization of the application
  useEffect(() => {
    try {
      if (!renderingEngineRf.current) {
        //if the rendering engine is not yet initialized
        renderingEngineRf.current = new RenderingEngine(); //initialization of the rendering engine(here babylonjs) which will handle the dimension spaces.
      }
      renderingEngineRf.current.canvas = reactCanvas.current; //set the canvas reference of babylonjs to our reference variable
      renderingEngineRf.current.initializeScene();
      return () => {
        renderingEngineRf.current.disposeEngine();
      };
    } catch (error) {
      handleError("Failed to initialize Babylon.js scene", error); // Handle error
      return;
    }
  }, [refresh]);

  //To be re-rendered whenever user decides to change the operation to perform.
  useEffect(() => {
    try {
      switch (operation) {
        case "draw":
          let vertices;

          renderingEngineRf.current.scene.onPointerObservable.add((info) => {
            switch (info.type) {
              case BABYLON.PointerEventTypes.POINTERDOWN: //If user has click the mouse button
                if (isLeftClick(info)) {
                  let pointClicked =
                    renderingEngineRf.current.getClickedPoint();
                  vertices = ShapeController.updateShapePoints(pointClicked); //keep updating the shape vertices till the user right clicks.
                  renderingEngineRf.current.createLines(vertices, false); //This creates shape with edgee without closing the loop
                }
                if (isRightClick(info)) {
                  renderingEngineRf.current.createLines(vertices, true); //This creates shape with edges with closing the loop.
                  ShapeController.finishDrawing();
                  //Once user decides to finish the drawing with right click, the event listerners are removed
                  //and user will have to click on draw button to get the listeners back.
                  renderingEngineRf.current.scene.onPointerObservable.clear();
                }
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
          let offsetToMoveTheShape = new BABYLON.Vector3(0, 0, 0); //initially with distance 0.

          renderingEngineRf.current.scene.onPointerObservable.add((info) => {
            switch (info.type) {
              case BABYLON.PointerEventTypes.POINTERDOWN:
                let data = renderingEngineRf.current.startMovingExtrudedShape();
                isDragging = data.isDragging;
                offsetToMoveTheShape = data.offset;
                break;

              case BABYLON.PointerEventTypes.POINTERMOVE:
                isDragging &&
                  renderingEngineRf.current.dragExtrudedShape(
                    isDragging,
                    offsetToMoveTheShape
                  );
                break;

              case BABYLON.PointerEventTypes.POINTERUP:
                //reset values
                isDragging = false;
                offsetToMoveTheShape = new BABYLON.Vector3(0, 0, 0);
                break;
            }
          });

          break;
        case "edit":
          // Variables for vertex editing
          let isEditing = false;
          let closestVertex;
          renderingEngineRf.current.scene.onPointerObservable.add((info) => {
            switch (info.type) {
              case BABYLON.PointerEventTypes.POINTERDOWN:
                if (isLeftClick(info)) {
                  let data = renderingEngineRf.current.editPoint();
                  isEditing = data.isEditing;
                  closestVertex = data.vertexToBeMoved;
                  break;
                } else if (isRightClick(info)) {
                  renderingEngineRf.current.camera.attachControl(
                    renderingEngineRf.current.canvas,
                    true
                  );

                  //reset values
                  isEditing = false;
                  closestVertex = undefined;
                  renderingEngineRf.current.dragBox.dispose();
                  break;
                }

              case BABYLON.PointerEventTypes.POINTERMOVE:
                if (isEditing) {
                  closestVertex = renderingEngineRf.current.movePoint(
                    isEditing,
                    closestVertex
                  );
                }
                break;
            }
          });

          break;
        default:
          //Cleanup all the event handlers in the scene, which allows to define different functions on similar event in different operations.
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

  // Error handling function
  function handleError(errorMessage, error) {
    console.error(errorMessage, error);
    setError(errorMessage); // Update error state
  }

  // Function to trigger a refresh or reset
  function handleRefresh() {
    setError(null); // Clear any existing error
    setRefresh((prev) => !prev); // Toggle state to trigger initialization useEffect
  }

  return (
    <>
      <canvas //canvas allows user to draw and babylonjs to render values.
        ref={reactCanvas} //the reference of babylonjs canvas is stored into our component reference, for us to interact with it
        //To fit the canvas into whole window screen on render.
        width={window.innerWidth}
        height={window.innerHeight}
        style={{ position: "absolute", top: "0px", left: "0px" }}
      />
      {error && (
        <div style={{ color: "red" }}>
          Error:{" "}
          {error /*Communciates what error occurred with our application */}
        </div>
      )}

      <button onClick={handleRefresh}>
        Retry
        {/*If any error occurrs with our application, this allows user to start fresh with it */}
      </button>
    </>
  );

  function isLeftClick(info) {
    return info.event.button == 0;
  }

  function isRightClick(info) {
    return info.event.button == 2;
  }
}
