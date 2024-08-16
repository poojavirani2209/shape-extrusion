class ShapeModel {
    constructor() {
      this.shapes = [];
      this.currentShapePoints = [];
      this.currentShape = null;
    }
  
    startShape(point) {
      this.currentShapePoints = [point];
    }
  
    addPointToShape(point) {
      if(this.currentShapePoints.length == 0){
        this.startShape(point)
      }
      this.currentShapePoints.push(point);
      //(this.currentShapePoints);
    }
  
    finishShape() {
      if (this.currentShapePoints.length > 2) {
        this.shapes.push({ points: this.currentShapePoints, height: 1 });
        this.currentShapePoints = [];
        //(this.shapes.length)
        this.currentShape = this.shapes[this.shapes.length-1]
      }
    }
  
    extrudeShape(index, height) {
      if (this.shapes[index]) {
        this.shapes[index].height = height;
      }
    }
  
    moveShape(index, offset) {
      if (this.shapes[index]) {
        this.shapes[index].points = this.shapes[index].points.map(point => ({
          x: point.x + offset.x,
          y: point.y + offset.y,
          z: point.z
        }));
      }
    }
  
    editVertex(index, vertexIndex, newPosition) {
      if (this.shapes[index]) {
        this.shapes[index].points[vertexIndex] = newPosition;
      }
    }
  }
  
  export default new ShapeModel();
  