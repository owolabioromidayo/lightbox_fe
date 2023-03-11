import React from "react";
import Slider from "../Slider";
import ColorPicker from "../ColorPicker";
import { hexToRgb } from "../../helpers/colorConverter";

export const ToolbarEffects = ({toolbarStore, setToolbarStore}) => {


  const setEffectProperty = (key, value) => {
       let newStore = {...toolbarStore}
       newStore.effectsStore[key] = value;
       if(key === "tintColor"){
        newStore.effectsStore["tintOpacity"] = 1;
       }
       setToolbarStore(newStore)
  }

  const resetEffects = () => {
       let newStore = {...toolbarStore}
       newStore.effectsStore = {
          brightness: 0,
          contrast: 0,
          saturation: 0,
          tintColor: "#000",
          tintOpacity: 0,
          invert: 0,
          hue: 0,
          noise: 0,
          blur: 0,
          pixelate : 1
       }

       setToolbarStore(newStore)
  }
  return (
    <div className="toolbar_settings">

      <div className="toolbar__content">
        <Slider
          title="Brightness"
          value={Math.round(toolbarStore.effectsStore.brightness * 250)}
          min={-100}
          max={100}
          callback={value => setEffectProperty("brightness", value/250)}
        />
        <Slider
          title="Contrast"
          value={Math.round(toolbarStore.effectsStore.contrast * 250)}
          min={-100}
          max={100}
          callback={value => setEffectProperty("contrast", value/250)}
        />
        <Slider
          title="Saturation"
          value={Math.round(toolbarStore.effectsStore.saturation * 100)}
          min={-100}
          max={100}
          callback={value => setEffectProperty("saturation", value/100)}
        />
        <Slider
          title="Hue Rotate"
          value={Math.round(toolbarStore.effectsStore.hue * 100)}
          min={-100}
          max={100}
          callback={value => setEffectProperty("hue", value/100)}
        />
        <Slider
          title="Pixelate"
          value={toolbarStore.effectsStore.pixelate}
          min={1}
          max={100}
          callback={value => setEffectProperty("pixelate", value)}
        />
        <Slider
          title="Noise"
          value={toolbarStore.effectsStore.noise}
          min={0}
          max={100}
          callback={value => setEffectProperty("noise", value)}
        />
        <Slider
          title="Invert"
          value={Math.round(toolbarStore.effectsStore.invert * 100)}
          min={0}
          max={100}
          callback={value => setEffectProperty("invert", value/100)}
        />
        <Slider
          title="Blur"
          value={Math.round(toolbarStore.effectsStore.blur * 100)}
          min={0}
          max={100}
          callback={value => setEffectProperty("blur", value/100)}
        />

        <Slider
          title="Tint"
          value={Math.round(toolbarStore.effectsStore.tintOpacity * 100)}
          min={0}
          max={100}
          callback={value => setEffectProperty("tintOpacity", value/100)}
        />
        <ColorPicker
          currentColorCode={hexToRgb(toolbarStore.effectsStore.tintColor)}
          callback={hex => setEffectProperty("tintColor", hex)}
          output="hex"
        />
        <button
          className="toolbar__action-btn"
          onClick={resetEffects}
        >Reset</button>
    </div>
    </div>
  );
};

export default ToolbarEffects;