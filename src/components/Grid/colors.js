export const colors={
  solid: `#000`,
  ground: `#9e9a38`,
  empty: `#fff`,
  water: `#4f7aea`,
  forest: `#145d05`,
};

export const getColorByValue=(value)=>{

  if(value===0){
    return colors.solid
  }

  if(value>0&&value<=0.5){
    return colors.forest
  }

  if(value>0.5&&value<=0.75){
    return colors.water
  }

  if(value>0.5&&value<=1){
    return colors.ground
  }


};