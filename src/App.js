import React          from 'react';
import styled         from 'styled-components';
import {Main}         from './components/Layout/Main';
import {StyledButton} from './components/Layout/StyledButton';
import {Grid}         from './components/Grid';
import {Screen}       from './components/Canvas/Screen';
import {Canvas}       from './components/Canvas/Canvas';
import {SlidePicker}  from './components/Input/SlidePicker';
import {ActionFrame}  from './components/ActionFrame';


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
    width: 280,
    height: 140,
    progress: 0,
    density: 0.5,
    smooth: 2,
    buffer: [],
    cellsize: 4,
  };

  grid = null;
  frameBuffer = [];

  componentDidMount(){
    this.canvas = new Canvas(this.canvasRef);
    window.addEventListener(Grid.eventName.GridGenerateProgress, this.onGenerateProgress);
    this.raf = new ActionFrame();
    // this.raf.init(this.loop);
  }

  // componentDidUpdate(){
  //   if (this.state.progress === 1){
  //     this.drawGrid();
  //   }
  // }

  loop = ()=>{
    if (this.frameBuffer.length > 0){
      const frame = this.frameBuffer.shift();
      // console.log(`frame`, frame);
      this.canvas.ctx.drawImage(frame, 0, 0);
      if (this.frameBuffer.length === 0){
        this.raf.stop();
      }
    }
  };

  onGenerateProgress = ({detail})=>{
    const {progress, buffer} = detail;
    this.setState({
      progress,
      // buffer,
    });
    const grid = this.canvas.draw.grid({
      ...this.state,
      buffer,
    });

    this.frameBuffer.push(grid);
    if (!this.raf.frame){
      // console.log(`onGenerateProgress`, this.frameBuffer);
      this.raf.init(this.loop);
    }

    // if (this.frameBuffer.length < 3){
    //   this.frameBuffer.push(grid);
    // }
    // if (this.frameBuffer.length === 3){
    //   this.frameBuffer.shift();
    //   this.frameBuffer.push(grid);
    // }
    // this.canvas.ctx.drawImage(grid, 0, 0);
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
      density: parseFloat(e.value),
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
              <span>grid density </span>
              <div>{Math.floor(density * 100)}</div>
              <SlidePicker
                min={0}
                max={1}
                value={density}
                onChange={this.onDensityChange}
              />
            </div>
            <div>
              <span>grid cellsize </span>
              <input
                type={`text`}
                name={`cellsize`}
                onChange={this.onChangeProp}
                value={cellsize}
                placeholder={`grid cellsize`}/>
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