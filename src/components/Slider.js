import React from "react";
import "../styles/Slider.css"

import {
  Slider as CSlider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  SliderMark,
} from '@chakra-ui/react'

const Slider= props => {
  const {
    title,
    value,
    min,
    max,
    step = 1,
    // startPoint = 0,
    // marks = {},
    callback,
  } = props;
  return (
    <div className="toolbar__block">
      <div className="slider__header">
        <span className="slider__title">{title}</span>
        <span className="slider__input">{value}</span>
      </div>
      {/* <CSlider aria-label='slider-ex-4' value={value} min={min} max={max} step={step} onChange={callback}>
      <SliderTrack bg='red.100'>
        <SliderFilledTrack bg='tomato' />
      </SliderTrack>
      <SliderThumb boxSize={6}>
      </SliderThumb>
    </CSlider> */}
    
      <input type="range" min={min} max={max} 
      value={value} 
      onChange={ e => {
          callback(parseInt(e.target.value))
        }} /> 
    </div>
  );
};

export default Slider;