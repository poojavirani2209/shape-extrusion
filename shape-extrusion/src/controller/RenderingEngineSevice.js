import * as BABYLON from "babylonjs";
import ShapeController from "./ShapeController";
import ShapeModel from "../model/ShapeModel";
import earcut from "earcut";

export class RenderingEngine {
  canvas;
  scene;
  engine;
  extrudedShape;
  camera;
  dragBox;
  advancedTexture;
  xIndexes;
  zIndexes;

  constructor() {
    this.canvas = null;
    this.scene = null;
    this.engine = null;
    this.extrudedShape = null;
    this.dragBox = null;
    this.advancedTexture = null;
  }

  initializeScene() {
    if (!this.canvas) return; //babylon canvas is not created yet.

    this.engine = new BABYLON.Engine(this.canvas, true);
    this.scene = new BABYLON.Scene(this.engine);
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
    this.camera = new BABYLON.FreeCamera(
      "camera",
      new BABYLON.Vector3(0, 5, -10),
      this.scene
    );
    this.camera.setTarget(BABYLON.Vector3.Zero()); // This targets the camera to scene origin
    this.camera.attachControl(this.canvas, true); // This attaches the camera to the canvas

    this.canvas = this.scene.getEngine().getRenderingCanvas();

    // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
    const light = new BABYLON.HemisphericLight(
      "light",
      new BABYLON.Vector3(0, 1, 0),
      this.scene
    );
    light.intensity = 0.8; // Default intensity is 1. This is done to dim the light

    BABYLON.MeshBuilder.CreateGround(
      "ground",
      { width: 10, height: 10 },
      this.scene
    );

    // Create AxesViewer
    new BABYLON.AxesViewer(this.scene, 3);
  }

  resizeEngine() {
    //(this.engine);
    this.engine.resize();
  }

  disposeEngine() {
    this.engine.dispose();
  }

  createLines(points) {
    BABYLON.MeshBuilder.CreateLines("line", { points }, this.scene);
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

  extrudeShape(points) {
    this.extrudedShape = BABYLON.MeshBuilder.ExtrudePolygon(
      `extruded Polygon`,
      {
        shape: points,
        depth: 1,
        sideOrientation: BABYLON.Mesh.DOUBLESIDE,
        updatable: true,
        wrap: true,
      },
      this.scene,
      earcut
    );

    this.extrudedShape.position.y = 1;
    this.extrudedShape.convertToFlatShadedMesh();

    const material = new BABYLON.StandardMaterial("material", this.scene);
    material.diffuseColor = new BABYLON.Color3(1, 0, 0); // Red color     // Set the color (using a diffuse color)
    this.extrudedShape.material = material; // Apply the material to the extruded mesh
  }

  startMovingExtrudedShape() {
    let pickInfo = this.scene.pick(this.scene.pointerX, this.scene.pointerY);
    if (pickInfo.hit && pickInfo.pickedMesh === this.extrudedShape) {
      // Calculate offset
      let offset = this.extrudedShape.position.subtract(pickInfo.pickedPoint);
      return { isDragging: true, offset };
    }
  }

  // Function to drag the mesh
  dragExtrudedShape(drag, offset) {
    if (drag) {
      // Update the position based on mouse position
      const newPickInfo = this.scene.pick(
        this.scene.pointerX,
        this.scene.pointerY
      );
      if (newPickInfo.hit) {
        this.extrudedShape.position = newPickInfo.pickedPoint.add(offset);
      }
    }
  }

  editPoint() {
    const newPickInfo = this.scene.pick(
      this.scene.pointerX,
      this.scene.pointerY
    );
    let closestVertex = this.getPointClosestVertex(
      newPickInfo.pickedPoint
    );
    this.addDragBox();
    return { isEditing: true, closestVertex };
  }

  addDragBox() {
   this.dragBox &&  this.dragBox.dispose();
    var ray = this.scene.createPickingRay(
      this.scene.pointerX,
      this.scene.pointerY,
      BABYLON.Matrix.Identity(),
      this.camera
    );
    var pickingInfo = this.scene.pickWithRay(ray);
    if (
      !!pickingInfo &&
      !!pickingInfo.pickedMesh &&
      pickingInfo.pickedMesh == this.extrudedShape
    ) {
      this.xIndexes = [];
      this.zIndexes = [];
      this.currentPickedMesh = pickingInfo.pickedMesh;

      var wMatrix = pickingInfo.pickedMesh.computeWorldMatrix(true);
      pickingInfo.pickedMesh.isPickable = true;
      var positions = pickingInfo.pickedMesh.getVerticesData(
        BABYLON.VertexBuffer.PositionKind
      );
      var indices = pickingInfo.pickedMesh.getIndices();

      this.dragBox = BABYLON.Mesh.CreateBox("dragBox", 0.15, this.scene);
      var vertexPoint = BABYLON.Vector3.Zero();
      this.fidx = pickingInfo.faceId;
      var minDist = Infinity;
      var dist = 0;
      var hitPoint = pickingInfo.pickedPoint;
      var idx = 0;
      var boxPosition = BABYLON.Vector3.Zero();
      if (!indices || !positions || !hitPoint) return;
      for (var i = 0; i < 3; i++) {
        idx = indices[3 * this.fidx + i];
        vertexPoint.x = positions[3 * idx];
        var initX = positions[3 * idx];
        vertexPoint.y = positions[3 * idx + 1];
        var initY = positions[3 * idx + 1];
        vertexPoint.z = positions[3 * idx + 2];
        var initZ = positions[3 * idx + 2];
        BABYLON.Vector3.TransformCoordinatesToRef(
          vertexPoint,
          wMatrix,
          vertexPoint
        );
        dist = vertexPoint.subtract(hitPoint).length();
        if (dist < minDist) {
          boxPosition = vertexPoint.clone();
          vertexPoint.x = initX;
          vertexPoint.z = initZ;
          minDist = dist;
        }
      }
      this.dragBox.position = boxPosition;
      for (var i = 0; i < positions.length; i++) {
        if (positions[i] == vertexPoint.x) {
          this.xIndexes.push(i);
        }
        if (positions[i] == vertexPoint.z) {
          this.zIndexes.push(i);
        }
      }

      this.dragBoxMat = new BABYLON.StandardMaterial("dragBoxMat", this.scene);
      this.dragBoxMat.diffuseColor = new BABYLON.Color3(1.4, 3, 0.2);
      this.dragBox.material = this.dragBoxMat;
    }
  }

  movePoint(edit, closestVertex) {
    if (edit) {
      const newPickInfo = this.scene.pick(
        this.scene.pointerX,
        this.scene.pointerY
      );
      let moveToPoint = newPickInfo.pickedPoint;
      var diff = closestVertex.selectedVertex.subtract(moveToPoint);
      this.dragBox.position.addInPlace(diff);
      var vertices = this.extrudedShape.getVerticesData(
        BABYLON.VertexBuffer.PositionKind
      );
      if (!vertices) {
        return;
      }
      vertices[closestVertex.index] = moveToPoint.x;
      vertices[closestVertex.index + 2] = moveToPoint.z;
      closestVertex.selectedVertex = moveToPoint;
    }
  }

  updateExtrudedShape = () => {
    var vertices = this.extrudedShape.getVerticesData(
      BABYLON.VertexBuffer.PositionKind
    );
    const updatedPoints = [];
    for (let i = 0; i < vertices.length; i += 3) {
      updatedPoints.push(
        new BABYLON.Vector3(vertices[i], vertices[i + 1], vertices[i + 2])
      );
    }
    if (this.extrudedShape) {
      this.extrudedShape.dispose(); // Remove old shape
    }

    if (updatedPoints.length > 2) {
      this.extrudeShape(updatedPoints);
    }
  };

  getPointClosestVertex(toPoint) {
    var vertices = this.extrudedShape.getVerticesData(
      BABYLON.VertexBuffer.PositionKind
    );
    let minDist = Infinity;
    console.log(toPoint);
    let selectedVertex;
    let index;
    console.log(vertices);
    for (let i = 0; i < vertices.length; i++) {
      const vertex = new BABYLON.Vector3(
        vertices[i],
        vertices[i + 1],
        vertices[i + 2]
      );
      //("vertext:", vertex);
      console.log(i);
      let distance = BABYLON.Vector3.Distance(vertex, toPoint);
      if (distance < minDist) {
        console.log(true);
        console.log(vertex);
        minDist = distance;
        selectedVertex = vertex;
        index = i;
        // console.log(selectedVertex)
      }
    }
    return { index: index, selectedVertex: selectedVertex };
  }
}
