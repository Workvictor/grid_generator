import {ActionFrame} from '../ActionFrame';

export class Grid{
	constructor(width, height){
		this.props = {
			width,
			height,
			onProgress: ()=>null,
		};
		this.buffer = [];
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
		return this.buffer.length === this.dataLength;
	}

	get progress(){
		return this.buffer.length / this.dataLength;
	}

	set onProgress(onProgress){
		this.props = {
			...this.props,
			onProgress,
		};
	};

	get buffer2d(){
		const result = [];
		for (let row = 0; row < this.height; row++){
			result.push([]);
			for (let col = 0; col < this.width; col++){
				const index = row * this.width + col;
				result[row].push(this.buffer[index]);
			}
		}
		return result;
	}

	bufferPush = (index)=>{
		const row = Math.floor(index / this.width);
		const col = index - row * this.width;
		return {
			row,
			col,
			value: Math.random(),
		};
	};

	generate = ()=>{
		const raf = new ActionFrame();
		const loop = ()=>{
			const startTime = window.performance.now();
			while (this.fulfilled === false && window.performance.now() - startTime < 16){
				this.buffer.push(this.bufferPush(this.buffer.length));
			}
			this.props.onProgress({
				progress: this.progress,
			});
			if (this.fulfilled){
				raf.stop();
			}
		};
		raf.init(loop);
	};

}