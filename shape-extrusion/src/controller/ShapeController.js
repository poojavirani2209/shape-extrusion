import ShapeModel from "../model/ShapeModel.js";

/**
 * This is the controller of shape modification. Only this class should directly access the data.
 * The view part communicated with controller, and controller gets the specific data and performs operations on the data.
 */
class ShapeController {
  constructor(operation) {
    this.operation = operation;
  }

  updateShapePoints(point) {
    ShapeModel.addPointToShape(point);
    return ShapeModel.currentShapePoints;
  }

  getCurrentShapePoints() {
    return ShapeModel.currentShape.points;
  }

  finishDrawing() {
    ShapeModel.finishShape();
  }
}

export default new ShapeController();
