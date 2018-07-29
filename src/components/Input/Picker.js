import React  from 'react';
import styled from 'styled-components';


export const Wrapper = styled.div.attrs({
  style: ({posX}) => ({
    left: `${posX}%`
  })
})`
  width: 10px;
  height: 10px;
  top: calc(50% - 5px);
  transform: translateX(-50%);
  border-radius: 50%;
  cursor: pointer;
  background: blueviolet;
  pointer-events: none;
  position: absolute;
`;

export class Picker extends React.Component{

  render(){

    const {
      className,
      posX,
    } = this.props;
    return (
      <Wrapper
        className={className}
        posX={posX}
      />
    );

  }

}