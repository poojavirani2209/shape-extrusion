import ShapeModel from "../model/ShapeModel.js";

class ShapeController {
  constructor(operation) {
    this.operation = operation;
  }

  setMode(mode) {
    this.operation = mode;
  }

  updateShapePoints(point) {
    ShapeModel.addPointToShape(point);
    return ShapeModel.currentShapePoints;
  }

  getCurrentShapePoints(){
    return ShapeModel.currentShapePoints;
  }

  finishDrawing() {
    ShapeModel.finishShape();
  }

  extrudeShape(index, height) {
    ShapeModel.extrudeShape(index, height);
  }

  moveShape(index, offset) {
    ShapeModel.moveShape(index, offset);
  }

  editVertex(index, vertexIndex, newPosition) {
    ShapeModel.editVertex(index, vertexIndex, newPosition);
  }
}

export default new ShapeController();
