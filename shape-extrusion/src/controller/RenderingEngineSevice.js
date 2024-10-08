import * as BABYLON from "babylonjs";
import earcut from "earcut";

/**
 * This is a service class, providing service of rendering 2D and 3D objects and allows to interact with them.
 * It has the logic, and the caller has to call the methods of this class for performing operations.
 *
 * This ensures separation of concern by adding a wrapper over the framework used.
 * If a better framework comes based on our requirement, the updation will mostly be required in this class only.
 */
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
  vertexMarkers;

  constructor() {
    //initialize parameters of rendering engine.
    this.canvas = null;
    this.scene = null;
    this.engine = null;
    this.extrudedShape = null;
    this.dragBox = null;
    this.advancedTexture = null;
    this.vertexMarkers = [];
  }

  /** Method to create a 3D scene with a plane ground.  */
  initializeScene() {
    if (!this.canvas) return; //babylon canvas is not created yet.

    this.engine = new BABYLON.Engine(this.canvas, true); //engine that handles all the rendering in the canvas
    this.scene = new BABYLON.Scene(this.engine); //scene to render in
    this.scene.clearColor = new BABYLON.Color3(0.5, 0.5, 0.5);

    if (this.scene.isReady()) {
      this.onSceneReady(this.scene);
    } else {
      this.scene.onReadyObservable.addOnce((scene) => {
        //event listener for whenever the scene is ready.
        this.scene = scene;
        this.onSceneReady();
      });
    }

    //Starts a render loop that repeatedly calls the provided callback function at each frame of the animation.
    //This loop is necessary to continuously update and render the 3D scene
    this.engine.runRenderLoop(() => {
      this.scene.render();
    });
  }

  /** Method to initialize the scene once ready with engine to handle the rendering, camera to view the scene, the light to make all the meshes visible*/
  onSceneReady() {
    // This creates and positions a free camera (non-mesh)
    this.camera = new BABYLON.FreeCamera(
      "camera",
      new BABYLON.Vector3(0, 5, -10),
      this.scene
    );
    this.camera.setTarget(BABYLON.Vector3.Zero()); // This targets the camera to scene origin
    this.camera.attachControl(this.canvas, true); // This attaches the camera to the canvas

    // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
    const light = new BABYLON.HemisphericLight(
      "light",
      new BABYLON.Vector3(0, 1, 0),
      this.scene
    );
    light.intensity = 0.8; // Default intensity is 1. This is done to dim the light

    BABYLON.MeshBuilder.CreateGround(
      //Creates a ground mesh, with specified width and height to fir in the scene.
      "ground",
      { width: 10, height: 10 },
      this.scene
    );

    //Shows the 3 plane axis over ground, for user to understand.
    new BABYLON.AxesViewer(this.scene, 3);
  }

  resizeEngine() {
    this.engine.resize();
  }

  disposeEngine() {
    this.engine.dispose(); //Cleanup engine.
  }

  /** Method to create edges between the vertices, in the order they come in. The second parameter is to define if to create a closed shape from the points by joining the first and last point.*/
  createLines(vertices, closeLoop) {
    let points = vertices;
    if (closeLoop) {
      points = [...points, vertices[0]];
    }
    BABYLON.MeshBuilder.CreateLines("line", { points }, this.scene);
  }

  /**
   * Method to get the vertices where the mouse clicked inside the scene.
   * @returns the vertices.
   */
  getClickedPoint() {
    const pickResult = this.scene.pick(
      this.scene.pointerX,
      this.scene.pointerY
    );
    if (pickResult.hit) {
      if (pickResult.pickedPoint.y < 0) {
        pickResult.pickedPoint.y = 0;
      }
      return pickResult.pickedPoint;
    }
    return null;
  }

  /**
   * Converts 2D to 3D shape by the usage of meshes.
   * @param {*} vertices vertices of the 2D shape.
   */
  extrudeShape(vertices) {
    this.extrudedShape = BABYLON.MeshBuilder.ExtrudePolygon(
      `extruded Polygon`,
      {
        shape: vertices,
        depth: 1,
        sideOrientation: BABYLON.Mesh.DOUBLESIDE,
        updatable: true,
        wrap: true,
      },
      this.scene,
      earcut //useful for creating meshes inside the polygon
    );

    this.extrudedShape.position.y = 1; //sets the vertical position of mesh as 1
    this.extrudedShape.convertToFlatShadedMesh(); //it shows as the lightning is on the face. Helps to show the polygon more angular giving it 3D presence.

    const material = new BABYLON.StandardMaterial("material", this.scene);
    material.diffuseColor = new BABYLON.Color3(1, 0, 0); // Red color, set the color (using a diffuse color)
    this.extrudedShape.material = material; // Apply the material to the extruded mesh
  }

  /**
   * Method to initialize the moving of the extruded shape.
   * @returns
   */
  startMovingExtrudedShape() {
    let pickInfo = this.scene.pick(this.scene.pointerX, this.scene.pointerY);
    if (pickInfo.hit && pickInfo.pickedMesh === this.extrudedShape) {
      console.log("dragg");
      // Calculate offset
      let offset = this.extrudedShape.position.subtract(pickInfo.pickedPoint);
      return { isDragging: true, offset };
    }
  }

  /**
   * Method to drag the mesh
   */
  dragExtrudedShape(drag, offset) {
    if (drag) {
      // Update the position based on mouse position
      let pointClicked = this.getClickedPoint();
      this.extrudedShape.position = pointClicked.add(offset);
    }
  }

  /**
   * Defines the vertex to be editable with a visual cue of deag box.
   * @returns
   */
  editPoint() {
    let pointerInfo = this.scene.pick(this.scene.pointerX, this.scene.pointerY);
    this.extrudedShapeVertices = this.getVerticesDataOfMesh(
      this.extrudedShape
    ).vertices;
    let minDist = Infinity;
    let closestIndex = -1;
    let offset;

    let vertexToBeMoved;
    if (pointerInfo.hit) {
      for (let i = 0; i < this.extrudedShapeVertices.length / 3; i++) {
        let vertex = new BABYLON.Vector3(
          this.extrudedShapeVertices[i * 3],
          this.extrudedShapeVertices[i * 3 + 1],
          this.extrudedShapeVertices[i * 3 + 2]
        );

        let dist = BABYLON.Vector3.Distance(pointerInfo.pickedPoint, vertex);
        if (dist < minDist) {
          minDist = dist;
          closestIndex = i;
        }
      }
      console.log(minDist);
      if (minDist < 1.5) {
        vertexToBeMoved = closestIndex;
        offset = pointerInfo.pickedPoint.subtract(
          new BABYLON.Vector3(
            this.extrudedShapeVertices[vertexToBeMoved * 3],
            this.extrudedShapeVertices[vertexToBeMoved * 3 + 1],
            this.extrudedShapeVertices[vertexToBeMoved * 3 + 2]
          )
        );
      }
      return { isEditing: true, vertexToBeMoved, offset };
    }
    return { isEditing: false, vertexToBeMoved: undefined };
    // let vertexToBeMoved = this.addDragBox();
  }

  /**
   * Creates and positions a drag box to allow the user to manipulate vertices of the mesh.
   * Disposes of any existing drag box before creating a new one.
   *
   * The drag box is placed at the vertex of the selected face that is closest to the clicked point.
   * The function calculates which vertex is the closest to the click position and updates the drag box's position accordingly.
   *
   * @returns {BABYLON.Vector3} The position of the drag box.
   */
  addDragBox() {
    this.dragBox && this.dragBox.dispose(); // Dispose of the existing drag box if it exists
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

      var worldMatrix = pickingInfo.pickedMesh.computeWorldMatrix(true); // Compute the world matrix for the picked mesh

      pickingInfo.pickedMesh.isPickable = true;
      let { vertices, indices } = this.getVerticesDataOfMesh(
        pickingInfo.pickedMesh
      );

      this.dragBox = BABYLON.Mesh.CreateBox("dragBox", 0.1, this.scene); // Create a new drag box mesh

      var vertexPoint = BABYLON.Vector3.Zero();
      // let faceIndexes = this.getFaceIds(pickingInfo.pickedMesh)
      this.faceIndex = pickingInfo.faceId;
      var minDist = Infinity; // Initialize minimum distance to a large value
      var dist = 0; // Distance between the clicked point and vertex
      var hitPoint = pickingInfo.pickedPoint;
      var currentVertexIndex = 0;
      var boxPosition = BABYLON.Vector3.Zero();

      if (!indices || !vertices || !hitPoint) return;

      // Iterate through the vertices of the selected face
      for (var i = 0; i < 3; i++) {
        currentVertexIndex = indices[3 * this.faceIndex + i];
        vertexPoint.x = vertices[3 * currentVertexIndex];
        var initX = vertices[3 * currentVertexIndex];
        vertexPoint.y = vertices[3 * currentVertexIndex + 1];
        var initY = vertices[3 * currentVertexIndex + 1];
        vertexPoint.z = vertices[3 * currentVertexIndex + 2];
        var initZ = vertices[3 * currentVertexIndex + 2];

        // Transform the vertex position to world coordinates
        BABYLON.Vector3.TransformCoordinatesToRef(
          vertexPoint,
          worldMatrix,
          vertexPoint
        );
        dist = vertexPoint.subtract(hitPoint).length(); // Calculate the distance between the vertex and the clicked point

        // Update the drag box position if this vertex is closer to the clicked point
        if (dist < minDist) {
          boxPosition = vertexPoint.clone();
          vertexPoint.x = initX;
          vertexPoint.z = initZ;
          minDist = dist;
        }
      }

      this.dragBox.position = boxPosition;

      // Determine which positions in the mesh correspond to the X and Z coordinates of the selected vertex
      for (var i = 0; i < vertices.length; i++) {
        if (vertices[i] == vertexPoint.x) {
          this.xIndexes.push(i);
        }
        if (vertices[i] == vertexPoint.z) {
          this.zIndexes.push(i);
        }
      }
    }
  }

  getVerticesDataOfMesh(mesh) {
    var vertices = mesh.getVerticesData(BABYLON.VertexBuffer.PositionKind);
    var indices = mesh.getIndices();
    return { vertices, indices };
  }

  /**
   * Move the vertex to recently mouse moved point, only in edit mode.
   * @param {} edit
   * @param {*} vertexToBeMoved
   * @returns
   */
  movePoint(vertexToBeMoved, offset) {
    console.log("move");
    try {
      if (!vertexToBeMoved) {
        return;
      }
      let pickedResult = this.scene.pick(
        this.scene.pointerX,
        this.scene.pointerY
      );
      var currentPoint = pickedResult.pickedPoint;
      let newVertexPosition = currentPoint.add(offset);
      this.updateVertexData(vertexToBeMoved, newVertexPosition);
      return vertexToBeMoved;
    } catch (error) {
      console.log(`Error occurred while moving the vertex`, error);
      return;
    }
  }

  rebuildExtrudedShape(vertices) {
    this.extrudedShape.dispose(); // Dispose of the old mesh
    this.extrudedShape = BABYLON.MeshBuilder.ExtrudePolygon(
      `extruded Polygon`,
      {
        shape: vertices,
        depth: 1,
        sideOrientation: BABYLON.Mesh.DOUBLESIDE,
        updatable: true,
        wrap: true,
      },
      this.scene,
      earcut
    );

    this.extrudedShape.position.y = 1 / 2; // Restore the vertical position
    this.extrudedShape.convertToFlatShadedMesh(); // Reapply the shading
    const material = new BABYLON.StandardMaterial("material", this.scene);
    material.diffuseColor = new BABYLON.Color3(1, 0, 0); // Red color, set the color (using a diffuse color)
    this.extrudedShape.material = material; // Apply the material to the extruded mesh
  }

  /**
   * Method to update the vertex data of extruded shape at a particular index
   * @param {*} index 
   * @param {*} newPosition 
   */
  updateVertexData(index, newPosition) {
    const vertices = this.extrudedShape.getVerticesData(
      BABYLON.VertexBuffer.PositionKind
    );
    if (vertices) {
      vertices[index * 3] = newPosition.x;
      vertices[index * 3 + 1] = newPosition.y;
      vertices[index * 3 + 2] = newPosition.z;

      this.extrudedShape.updateVerticesData(
        BABYLON.VertexBuffer.PositionKind,
        vertices
      );
      this.extrudedShape.refreshBoundingInfo();
      this.extrudedShape.computeWorldMatrix(true);
    }
  }

  /**
   * Method to get latest vertices data of extruded shape in vector format
   * @returns 
   */
  getUpdatedVerticesData() {
    const vertices = this.extrudedShape.getVerticesData(
      BABYLON.VertexBuffer.PositionKind
    );
    const updatedVertices = [];

    for (let i = 0; i < vertices.length / 3; i++) {
      updatedVertices.push(
        new BABYLON.Vector3(
          vertices[i * 3],
          vertices[i * 3 + 1],
          vertices[i * 3 + 2]
        )
      );
    }
    return updatedVertices;
  }

  disposeDragBox() {
    if (this.dragBox) {
      this.dragBox.dispose();
      this.dragBox = null;
    }
  }

  disposeExtrudedShape() {
    if (this.extrudedShape) {
      this.extrudedShape.dispose();
    }
  }
}
