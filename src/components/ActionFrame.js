export class ActionFrame{

	constructor(){
		this.requestID = null;
		this.frame = null;
		this.running = false;
	}

	run = (t)=>{
		(this.running && this.frame) && this.frame(t);
		this.requestID = window.requestAnimationFrame(this.run);
	};

	stop = ()=>{
		this.frame = null;
		window.cancelAnimationFrame(this.requestID);
	};

	loop = (t)=>this.frame ? this.run(t) : this.stop();

	pause = ()=>{
		this.running = false;
	};

	continue = ()=>{
		this.running = true;
	};

	init = (loop)=>{
		this.frame = loop;
		this.running = true;
		this.frame && this.run(0);
	};

}