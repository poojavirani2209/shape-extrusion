/**
 * This class handles the data of shapes created.
 */
class ShapeModel {
  constructor() {
    this.shapes = [];
    this.currentShapePoints = [];
    this.currentShape = null;
  }

  startShape(point) {
    this.currentShapePoints = [point]; //initial array.
  }

  /**
   * Method to store the vertices of the shape created in 2D on the ground.
   */
  addPointToShape(point) {
    if (this.currentShapePoints.length == 0) {
      //if the shape creation has just started
      this.startShape(point);
    }
    this.currentShapePoints.push(point);
  }

  /**
   * Store the array of vertices for the latest shape, and store it in the shapes array.
   */
  finishShape() {
    if (this.currentShapePoints.length > 2) {
      this.shapes.push({ points: this.currentShapePoints });
      this.currentShapePoints = []; //empty to store points of the new shape whenever drawn.
      this.currentShape = this.shapes[this.shapes.length - 1]; //get the latest shape.
    }
  }
}

export default new ShapeModel();
