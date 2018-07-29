import React          from 'react';
import styled         from 'styled-components';
import {Main}         from './components/Layout/Main';
import {StyledButton} from './components/Layout/StyledButton';
import {Grid}         from './components/Grid';
import {Screen}       from './components/Canvas/Screen';
import {Canvas}       from './components/Canvas/Canvas';
import {SlidePicker}  from './components/Input/SlidePicker';


const Wrapper = styled.div`
	padding: 24px;
`;

const Display = styled.div`
	margin: 16px auto;
	display: flex;
  align-items: center;
  justify-content: center;
`;

const Form = styled.div`
  width: 250px;
  padding: 16px;
`;

export class App extends React.Component{

  state = {
    width: 340,
    height: 280,
    progress: 0,
    density: 0.5,
    smooth: 2,
    buffer: [],
    cellsize: 2,
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
    this.setState({
      progress: 0,
      buffer: [],
    });
  };

  onChangeProp = e=>{
    this.setState({
      [e.currentTarget.name]: Number(e.currentTarget.value),
    });
  };

  generateMap = ()=>{

    this.grid = new Grid({
      ...this.state,
    });

  };

  onDensityChange = (e)=>{
    this.setState({
      density: e.value,
    });
  };

  render(){
    const {
      width,
      height,
      smooth,
      progress,
      density,
      cellsize,
    } = this.state;
    return (
      <Main>
        <Wrapper>
          <Form>
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
            <div>
              <span>grid smooth </span>
              <input
                type={`text`}
                name={`smooth`}
                onChange={this.onChangeProp}
                value={smooth}
                placeholder={`grid smooth`}/>
            </div>
            <div>
              <SlidePicker
                min={0}
                max={1}
                onChange={this.onDensityChange}
              />
              <span>grid density </span>
              <div>{density}</div>
            </div>
            <StyledButton
              onClick={this.generateMap}>generate map</StyledButton>
            <div>
              progress: {Math.floor(progress * 100)}
            </div>
          </Form>
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