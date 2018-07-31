import {getColorByValue} from '../Grid/colors';

export class Canvas{

  props = {};

  constructor(ref){
    this.props = {
      ...this.props,
      ref,
    };
  }

  x = 0;
  y = 0;

  get styles(){
    return window.getComputedStyle(this.canvas);
  }

  get canvas(){
    return this.props.ref;
  }

  get ctx(){
    return this.canvas.getContext(`2d`);
  }

  get create(){
    const path = ()=>{
      return new Path2D();
    };
    const canvas = (width, height)=>{
      const buffer = document.createElement(`canvas`);
      buffer.width = width;
      buffer.height = height;
      buffer.ctx = buffer.getContext('2d');
      return buffer;
    };
    return {
      path,
      canvas,
    };
  }

  isPointInPath({point, path}){
    if (path && point.x && point.y){
      return this.ctx.isPointInPath(path, point.x, point.y);
    }
  }

  fill({fillStyle, path}){
    if (fillStyle){
      this.ctx.fillStyle = fillStyle;
      this.ctx.fill(path);
    }
  }

  stroke({strokeStyle, lineWidth, path}){
    if (strokeStyle){
      this.ctx.lineWidth = lineWidth;
      this.ctx.strokeStyle = strokeStyle;
      this.ctx.stroke(path);
    }
  }

  getView(grid){
    return {
      output: {
        width: 0,
        height: 0,
        offset: {
          x: 0,
          y: 0,
        },
      },

    };
  }

  buffer = [];

  get draw(){

    const grid = (props)=>{
      const {
        width = 0,
        height = 0,
        cellsize,
        buffer,
      } = props;

      const grid = this.create.canvas(width * cellsize, height * cellsize);
      for (let cell of buffer){
        grid.ctx.fillStyle = getColorByValue(cell.value);
        grid.ctx.fillRect(cellsize * cell.col, cellsize * cell.row, cellsize, cellsize);
      }

      return grid;

    };

    const rect = (props)=>{
      const {
        width = 0,
        height = 0,
        x = 0,
        y = 0,
        fillStyle,
        strokeStyle,
        lineWidth,
      } = props;
      const buffer = this.create.canvas(width, height);
      const path = buffer.create.path();
      path.rect(0, 0, width, height);
      buffer.fill({
        fillStyle,
        path,
      });
      buffer.stroke({
        strokeStyle,
        lineWidth,
        path,
      });
      this.ctx.drawImage(buffer.canvas, x, y);
      return buffer.canvas;
    };

    const path = (props)=>{
      const {
        path,
        fillStyle,
        strokeStyle,
        lineWidth,
      } = props;
    };

    return {
      rect,
      grid,
    };
  }

}