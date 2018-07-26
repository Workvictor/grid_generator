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

const eventTimeout = 40;

export class Grid{

	constructor({
								width,
								height,
								smooth = 1,
								isAsync = true,
							}){

		this.props = {
			...defaultProps,
			width,
			height,
			smooth,
			isAsync,
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

						if (cell.value > 0.5){
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

			const gProgress = BUFFER.length / this.dataLength;
			const sProgress = smoothIteraction / (this.dataLength * this.props.smooth);

			return gProgress;
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

			setBuffer([]);

			let eventTime = window.performance.now();
			dispatchProgressEvent();

			const raf = new ActionFrame();
			const loop = ()=>{

				const startTime = window.performance.now();

				while (this.fulfilled === false && window.performance.now() - startTime < 16){
					const value = Math.random();
					BUFFER.push({
						row: this.convert.indexToRow(BUFFER.length),
						col: this.convert.indexToColumn(BUFFER.length),
						value: value > 0.5 ? 1 : 0,
					});
				}

				if (window.performance.now() - eventTime > eventTimeout){
					eventTime = window.performance.now();
					dispatchProgressEvent();
				}


				if (this.fulfilled){
					raf.stop();
					dispatchProgressEvent();
					// if (this.props.smooth){
					// 	this.processing.smooth(this.props.smooth);
					// }
				}
			};
			raf.init(loop);
		};

		const smooth = (smoothCount = 1)=>{

			let index = 0;

			const threshold = 3;

			const result = [];
			let eventTime = window.performance.now();
			const raf = new ActionFrame();

			const loop = ()=>{

				const startTime = window.performance.now();

				while (window.performance.now() - startTime < 16 && index < this.dataLength){

					const neighbors = this.getNeighbors(index);

					index++;

					if (neighbors.length > threshold){
						result.push({
							value: 1,
						});
					}

					if (neighbors.length < threshold){
						result.push({
							value: 0,
						});
					}

					if (neighbors.length === threshold){
						result.push({
							value: BUFFER[index],
						});
					}

					smoothIteraction++;
					if (window.performance.now() - eventTime > eventTimeout){
						eventTime = window.performance.now();
						dispatchProgressEvent();
					}
				}

				if (index === this.dataLength){
					smoothCount--;
					setBuffer(result);
					dispatchProgressEvent();
					index = 0;
				}

				if (smoothCount === 0){
					raf.stop();
					setBuffer(result);
					dispatchProgressEvent();
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