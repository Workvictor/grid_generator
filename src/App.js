import React          from 'react';
import styled         from 'styled-components';
import {Main}         from './components/Layout/Main';
import {StyledButton} from './components/Layout/StyledButton';
import {Grid}         from './components/Grid';
import {Screen}       from './components/Canvas/Screen';
import {Canvas}       from './components/Canvas/Canvas';


const Wrapper = styled.div`
	padding: 24px;
`;

const Display = styled.div`
	width: 960px;
	height: 540px;
	margin: 16px auto;
`;

export class App extends React.Component{

	state = {
		width: 40,
		height: 30,
		progress: 0,
		buffer: [],
		cellsize: 8,
	};

	grid = null;

	componentDidMount(){
		this.canvas = new Canvas(this.canvasRef);
		window.addEventListener(Grid.eventName.GridGenerateProgress, this.onGenerateProgress);
	}

	componentDidUpdate(){
		if (this.state.progress === 1){
			this.drawGrid();
		}
	}

	onGenerateProgress = ({detail})=>{
		const {progress, buffer} = detail;
		this.setState({
			progress,
			buffer,
		});
	};

	drawGrid = ()=>{
		const grid = this.canvas.draw.grid({
			...this.state,
		});
		this.canvas.ctx.drawImage(grid, 0, 0);
	};

	onChangeProp = e=>{
		this.setState({
			[e.currentTarget.name]: parseInt(e.currentTarget.value, 10),
		});
	};

	generateMap = ()=>{

		const {width, height} = this.state;

		this.grid = new Grid({
			width,
			height,
		});

	};

	render(){
		const {width, height, progress, cellsize} = this.state;
		return (
			<Main>
				<Wrapper>
					<div>
						<span>grid width </span>
						<input
							type={`text`}
							name={`width`}
							onChange={this.onChangeProp}
							value={width}
							placeholder={`grid width`}/>
					</div>
					<div>
						<span>grid height </span>
						<input
							type={`text`}
							name={`height`}
							onChange={this.onChangeProp}
							value={height}
							placeholder={`grid height`}/>
					</div>
					<StyledButton
						onClick={this.generateMap}>generate map</StyledButton>
					<div>
						progress: {Math.floor(progress * 100)}
					</div>
					<Display>
						<Screen
							width={width * cellsize}
							height={height * cellsize}
							innerRef={ref=>this.canvasRef = ref}/>
					</Display>
				</Wrapper>
			</Main>
		);
	}
}