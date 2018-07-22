import React          from 'react';
import styled         from 'styled-components';
import {Main}         from './components/Layout/Main';
import {StyledButton} from './components/Layout/StyledButton';
import {Grid}         from './components/Grid';


const Wrapper = styled.div`
	padding: 24px;
`;

const Flex = styled.div`
	display: flex;
`;

const Cell = styled.div`
	font-size: 10px;
	width: 32px;
	height: 32px;
	display: flex;
	overflow: hidden;
	align-items: center;
	justify-content: center;
	background-color: #8d8d8d;
	white-space: nowrap;
	text-overflow: ellipsis;
	&:hover{
		background-color: #cccccc;
	}
`;

export class App extends React.Component{

	state = {
		progress: 0,
		data2d: [],
		gridWidth: 10,
		gridHeight: 10,
	};

	onWidthChange = (e)=>{
		this.setState({
			gridWidth: parseInt(e.currentTarget.value, 10),
		});
	};

	onHeightChange = (e)=>{
		this.setState({
			gridHeight: parseInt(e.currentTarget.value, 10),
		});
	};

	generateMap = ()=>{
		const {gridWidth, gridHeight} = this.state;
		this.setState({
			data2d: [],
		});
		this.grid = new Grid(gridWidth, gridHeight);
		this.grid.onProgress = (e)=>{
			this.setState({
				progress: e.progress,
			});
			if (e.progress === 1){
				this.setState({
					data2d: this.grid.buffer2d,
				});
			}
		};
		this.grid.generate();
	};

	render(){
		const {gridWidth, gridHeight} = this.state;
		return (
			<Main>
				<Wrapper>
					<div>
						<span>grid width </span>
						<input type={`text`} onChange={this.onWidthChange} value={gridWidth} placeholder={`grid width`}/>
					</div>
					<div>
						<span>grid height </span>
						<input type={`text`} onChange={this.onHeightChange} value={gridHeight} placeholder={`grid height`}/>
					</div>
					<StyledButton
						onClick={this.generateMap}>generate map</StyledButton>
					<div>
						progress: {this.state.progress}
					</div>
					<div>
						{this.state.data2d.map((row, id)=>(
							<Flex key={id}>
								{row.map(elem=>`${elem.row}, ${elem.col}`).map(elem=><Cell key={elem}>{elem}</Cell>)}
							</Flex>
						))}
					</div>
				</Wrapper>
			</Main>
		);
	}
}