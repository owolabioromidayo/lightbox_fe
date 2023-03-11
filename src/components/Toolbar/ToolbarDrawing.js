import Slider from "../Slider";
import ColorPicker from "../ColorPicker";
import ToggleButton from "../ToggleButton";
import { useState } from "react";

const ToolbarDrawing= ({toolbarStore, setToolbarStore}) => {

  const setDrawingProperty = (key, value) => {
       let newStore = {...toolbarStore}
       newStore.drawingStore[key] = value
       setToolbarStore(newStore)
  }
  return (
    <div className="toolbar__content">
      <ColorPicker
        title="Colors"
        currentColorCode={toolbarStore.drawingStore.colorCode}
        callback = { rgbCode => setDrawingProperty("colorCode", rgbCode )}
        output="hex"
      />
      <Slider
        title="Width"
        value={toolbarStore.drawingStore.lineWidth}
        min={1}
        max={150}
        callback = {value => setDrawingProperty("lineWidth", value)}
      />
      <Slider
        title="Opacity"
        value={Math.round(toolbarStore.drawingStore.opacity * 100)}
        min={0}
        max={100}
        callback = {value => setDrawingProperty("opacity", value/100)}
      />
      {/* <ToggleButton
        title="Straight Line"
        checked={toolbarStore.drawingStore.isLineStraight}
        callback={() =>setToolbarStore(
          {...toolbarStore, drawingStore:
             {...toolbarStore.drawingStore, isLineStraight: !toolbarStore.drawingStore.isLineStraight } })}
      /> */}
    </div>
  )
};

export default ToolbarDrawing;