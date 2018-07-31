import React    from 'react';
import styled   from 'styled-components';
import {Picker} from './Picker';


const Bar = styled.div`
  height: 14px;
  width: 100%;
  border-radius: 8px;
  background: beige;
  cursor: pointer;
  box-shadow: inset 0 0 3px blueviolet;
  position: relative;
`;

const offset = 7;
let relativeX, absoluteX, offsetLeft, offsetWidth;

export class SlidePicker extends React.Component{

  static defaultProps = {
    min: 0,
    max: 1,
    onChange: ()=>null,
  };

  constructor(props){
    super(props);
    this.state = {
      posX: this.getPropsValue(props.value),
    };
  }

  targetBar = null;

  componentDidMount(){
    offsetLeft = this.targetBar.offsetLeft;
    offsetWidth = this.targetBar.offsetWidth;
  }

  componentWillUnmount(){
    window.removeEventListener(`mousemove`, this.onMousemove);
    window.removeEventListener(`mouseup`, this.onMouseup);
  }

  shouldComponentUpdate(nextProps, nextState){
    return this.state !== nextState;
  }

  componentDidUpdate(){
    this.props.onChange({
      value: this.value,
    });
  }

  componentWillReceiveProps(nextProps){
    const {max, min} = this.props;
    if (nextProps.value !== this.state.posX*(max - min)){
      this.setState({
        posX: this.getPropsValue(nextProps.value),
      });
    }
  }

  get value(){
    const {max, min} = this.props;
    return relativeX * (max - min);
  }

  getPropsValue = (x)=>{
    const {max, min} = this.props;
    return x * (max - min);
  };

  addListeners = ()=>{
    window.addEventListener(`mousemove`, this.onMousemove);
    window.addEventListener(`mouseup`, this.onMouseup);
  };

  getPosX = (clientX)=>{

    const x = clientX - offsetLeft;
    const width = offsetWidth;

    const min = offset / width;
    const max = (width - offset) / width;

    const delta = x / width;

    relativeX = Math.min(1, Math.max(0, delta));
    absoluteX = Math.min(max, Math.max(min, delta));

    return absoluteX;

  };

  onMousemove = (event)=>{
    if (this.targetBar){

      const posX = this.getPosX(event.clientX);

      this.setState({
        posX,
      });

    }
  };

  onMouseup = ()=>{

    window.removeEventListener(`mousemove`, this.onMousemove);
    window.removeEventListener(`mouseup`, this.onMouseup);

    this.targetBar = null;

  };

  onPickUp = (event)=>{
    this.setState({
      posX: this.getPosX(event.clientX),
    }, this.addListeners);

  };

  render(){
    return (
      <div>
        <Bar
          innerRef={ref=>this.targetBar = ref}
          onMouseDown={this.onPickUp}>
          <Picker
            posX={this.state.posX * 100}
          />
        </Bar>
      </div>
    );
  }
}