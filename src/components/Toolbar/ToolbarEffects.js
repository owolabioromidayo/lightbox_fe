import React from "react";
import Slider from "../Slider";
import ColorPicker from "../ColorPicker";
import { hexToRgb } from "../../helpers/colorConverter";

export const ToolbarEffects = () => {

  return (
    <div className="toolbar_settings">

      <div className="toolbar__content">
        <Slider
          title="Brightness"
          // value={Math.round(image.effects.brightness * 250)}
          min={0}
          max={10}
          value={2}
          callback={() => {}}
        />
        <Slider
          title="Contrast"
          // value={Math.round(image.effects.contrast * 250)}
          min={-100}
          max={100}
          // callback={value => image.effects.contrast = value / 250}
          callback={value => 250}
        />
        <Slider
          title="Saturation"
          // value={Math.round(image.effects.saturation * 100)}
          min={-100}
          max={100}
          // callback={value => image.effects.saturation = value / 100}
          callback={value => 250}
        />
        <Slider
          title="Hue Rotate"
          // value={Math.round(image.effects.hue * 100)}
          min={-100}
          max={100}
          // callback={value => image.effects.hue = value / 100}
          callback={value => 250}
        />
        <Slider
          title="Pixelate"
          // value={image.effects.pixelate}
          min={1}
          max={100}
          // callback={value => image.effects.pixelate = value}
          callback={value => 250}
        />
        <Slider
          title="Noise"
          // value={image.effects.noise}
          min={0}
          max={100}
          // callback={value => image.effects.noise = value}
          callback={value => 250}
        />
        <Slider
          title="Invert"
          // value={Math.round(image.effects.invert * 100)}
          min={0}
          max={100}
          // callback={value => image.effects.invert = value / 100}
          callback={value => 250}
        />
        <Slider
          title="Blur"
          // value={Math.round(image.effects.blur * 100)}
          min={0}
          max={100}
          // callback={value => image.effects.blur = value / 100}
          callback={value => 250}
        />

        <Slider
          title="Tint"
          // value={Math.round(image.effects.tintOpacity * 100)}
          min={0}
          max={100}
          // callback={value => image.effects.tintOpacity = value / 100}
          callback={value => 250}
        />
        <ColorPicker
          // currentColorCode={hexToRgb(image.effects.tintColor)}
          callback={value => 250}
          // callback={hex => {
          //   image.effects.tintColor = hex;
          //   image.effects.tintOpacity = 1;
          // }}
          output="hex"
        />
        <button
          className="toolbar__action-btn"
          // onClick={() => image.effects.resetAll()}
        >Reset</button>
    </div>
    </div>
  );
};

export default ToolbarEffects;