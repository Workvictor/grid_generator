import {ActionFrame} from '../ActionFrame';

const defaultProps = {
  width: 100,
  height: 100,
};

let BUFFER = [];

const setBuffer = buffer=>{
  BUFFER = buffer;
};

let smoothIteraction = 0;

const eventTimeout = 160;

export class Grid{

  constructor({
                width,
                height,
                smooth,
                isAsync = true,
                density = 0.5,
              }){

    this.props = {
      ...defaultProps,
      width,
      height,
      smooth,
      isAsync,
      density,
    };

    if (isAsync){

      this.processing.generate();

    }

  }

  static eventName = {
    GridGenerateProgress: `GridGenerateProgress`,
    GridFulfilled: `GridFulfilled`,
  };

  get buffer(){
    return BUFFER;
  }

  get width(){
    return this.props.width;
  }

  get height(){
    return this.props.height;
  }

  get dataLength(){
    return this.width * this.height;
  }

  get fulfilled(){
    return BUFFER.length === this.dataLength;
  }

  get progress(){
    const gProgress = BUFFER.length / this.dataLength;
    const sProgress = smoothIteraction / (this.dataLength * this.props.smooth);
    // const overallProgress=(gProgress+sProgress)/2;
    // return BUFFER.length / this.dataLength;
    return (gProgress + sProgress) / 2;
  }

  get buffer2d(){
    const result = [];
    for (let row = 0; row < this.height; row++){
      result.push([]);
      for (let col = 0; col < this.width; col++){
        const index = row * this.width + col;
        result[row].push(BUFFER[index]);
      }
    }
    return result;
  }

  getCell = (row, col)=>{
    return BUFFER[this.convert.cellToIndex(row, col)];
  };

  getNeighbors = index=>{
    //n[x,y] n[x,y] n[x,y]
    //n[x,y] !index n[x,y]
    //n[x,y] n[x,y] n[x,y]

    const result = [];

    const indexCell = {
      row: this.convert.indexToRow(index),
      col: this.convert.indexToColumn(index),
    };

    for (let row = indexCell.row - 1; row <= indexCell.row + 1; row++){
      for (let col = indexCell.col - 1; col <= indexCell.col + 1; col++){

        if (!this.calc.outOfBounds(row, col)){

          if (!(row === indexCell.row && col === indexCell.col)){

            const cell = this.getCell(row, col);

            if (cell && cell.value > 0.5){
              result.push(cell);
            }

          }

        }

      }
    }
    return result;
  };

  get convert(){

    const indexToColumn = index=>index - indexToRow(index) * this.width;

    const indexToRow = index=>Math.floor(index / this.width);

    const cellToIndex = (row, col)=>row * this.width + col;

    return {
      indexToColumn,
      indexToRow,
      cellToIndex,
    };
  }

  get calc(){

    const outOfBounds = (row, col)=>{
      return row < 0 || row >= this.height || col < 0 || col >= this.width;
    };

    return {
      outOfBounds,
    };
  }

  get processing(){

    const getProgress = ()=>{

      const overallProgress = ()=>(BUFFER.length + smoothIteraction) / (this.dataLength + this.dataLength * this.props.smooth);
      const bufferProgress = ()=>BUFFER.length / this.dataLength;
      const smoothProgress = ()=>smoothIteraction / (this.dataLength * this.props.smooth);

      return this.props.smooth > 0 ? smoothProgress() : bufferProgress();
    };

    const dispatchProgressEvent = ()=>{

      const detail = {
        progress: getProgress(),
        buffer: BUFFER,
      };
      const GridGenerateProgress = new CustomEvent(`GridGenerateProgress`, {detail});
      window.dispatchEvent(GridGenerateProgress);

    };

    const generate = ()=>{

      const getValue = (row, col)=>{
        const rand = Math.random();
        const edge = col === this.width - 1 || col === 0 || row === this.height - 1 || row === 0;
        let result = rand > this.props.density ? 1 : 0;
        if (edge){
          result = 0;
        }
        return result;
      };

      setBuffer([]);

      const raf = new ActionFrame();
      const loop = ()=>{

        const startTime = window.performance.now();

        while (this.fulfilled === false && window.performance.now() - startTime < 16){

          const row = this.convert.indexToRow(BUFFER.length);
          const col = this.convert.indexToColumn(BUFFER.length);

          const value = getValue(row, col);

          BUFFER.push({
            row,
            col,
            value,
          });
        }


        if (this.fulfilled){

          raf.stop();

          dispatchProgressEvent();

          if (this.props.smooth > 0){
            this.processing.smooth(this.props.smooth);
          }

        }
      };
      raf.init(loop);
    };

    const smooth = (smoothCount = 0)=>{

      let index = 0;
      smoothIteraction = 0;

      const thresholdMax = 4;
      const thresholdMin = thresholdMax - 1;


      const raf = new ActionFrame();

      const loop = ()=>{

        const startTime = window.performance.now();

        while (window.performance.now() - startTime < 16 && index < this.dataLength){

          const neighbors = this.getNeighbors(index);


          const row = BUFFER[index].row;
          const col = BUFFER[index].col;

          const edge = row === 0 || col === 0 || row === this.height - 1 || col === this.width - 1;

          BUFFER[index].value = Math.round(BUFFER[index].value);

          if (neighbors.length > thresholdMax){
            BUFFER[index].value = 1;
          }

          if (neighbors.length < thresholdMin){
            BUFFER[index].value = 0;
          }

          if (edge){
            BUFFER[index].value = 0;
          }

          index++;
          smoothIteraction++;

        }

        if (index === this.dataLength){
          smoothCount--;
          dispatchProgressEvent();
          index = 0;
        }

        if (smoothCount === 0){
          raf.stop();
          index = 0;
          smoothIteraction = 0;
        }

      };

      raf.init(loop);

    };

    return {
      generate,
      smooth,
    };
  }

}