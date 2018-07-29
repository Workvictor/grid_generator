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

let relativeX, absoluteX;

export class SlidePicker extends React.Component{

  static defaultProps = {
    min: 0,
    max: 1,
    onChange: ()=>null,
  };

  state = {
    posX: 0,
  };

  targetBar = null;

  componentWillUnmount(){
    window.removeEventListener(`mousemove`, this.onMousemove);
    window.removeEventListener(`mouseup`, this.onMouseup);
  }

  shouldComponentUpdate(nextProps, nextState){
    return this.state !== nextState;
  }

  componentDidUpdate(){
    const {max, min} = this.props;
    this.props.onChange({
      value: relativeX * (max - min),
    });
  }

  addListeners = ()=>{
    window.addEventListener(`mousemove`, this.onMousemove);
    window.addEventListener(`mouseup`, this.onMouseup);
  };

  getPosX = ({currentTarget, clientX})=>{

    const offset = 7;

    const x = clientX - currentTarget.offsetLeft;
    const width = currentTarget.offsetWidth;

    const min = offset / width;
    const max = (width - offset) / width;

    const delta = x / width;

    relativeX = Math.min(1, Math.max(0, delta));
    absoluteX = Math.min(max, Math.max(min, delta));

    return absoluteX;

  };

  onMousemove = (event)=>{
    if (this.targetBar){

      const posX = this.getPosX({
        currentTarget: this.targetBar,
        clientX: event.clientX,
      });

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

    this.targetBar = event.currentTarget;
    this.setState({
      posX: this.getPosX(event),
    }, this.addListeners);

  };

  render(){
    return (
      <div>
        <Bar
          onMouseDown={this.onPickUp}>
          <Picker
            posX={this.state.posX * 100}
          />
        </Bar>
      </div>
    );
  }
}