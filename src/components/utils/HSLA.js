import {calc} from '../utils';

export class HSLA{
	constructor(props){

		const getHex = hex=>{
			return hex.replace(`#`, ``).split(``);
		};

		const input = typeof props === `string` ? getHex(props) : props;

		this.props = {
			hsla: input,
		};
	}

	get h(){
		return this.props.hsla[0] && calc.bounds(this.props.hsla[0], 0, 360);
	}

	get s(){
		return this.props.hsla[1] && calc.bounds(this.props.hsla[1], 0, 100);
	}

	get l(){
		return this.props.hsla[2] && calc.bounds(this.props.hsla[2], 0, 100);
	}

	get a(){
		return this.props.hsla[3] && calc.bounds(this.props.hsla[3], 0, 1);
	}

	get data(){
		return [
			this.h,
			this.s,
			this.l,
			this.a,
		];
	}

	get toCss(){
		return `hsla(${this.h},${this.s}%,${this.l}%,${this.a})`;
	}

	setHue = (hue)=>{
		const data = [
			hue,
			this.s,
			this.l,
			this.a,
		];
		return new HSLA(data);
	};

	setSaturation = (saturation)=>{
		const data = [
			this.h,
			saturation,
			this.l,
			this.a,
		];
		return new HSLA(data);
	};

	setLight = (light)=>{
		const data = [
			this.h,
			this.s,
			light,
			this.a,
		];
		return new HSLA(data);
	};

	setAlpha = (alpha)=>{
		const data = [
			this.h,
			this.s,
			this.l,
			alpha,
		];
		return new HSLA(data);
	};

	// return hsla;
}