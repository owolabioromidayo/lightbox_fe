import React from "react";
import {ReactComponent as Bold}  from "../../assets/bold.svg";
import {ReactComponent as Underline}  from "../../assets/underline.svg";
import {ReactComponent as Italic}  from "../../assets/italic.svg";
import {ReactComponent as AlignLeft}  from "../../assets/align-left.svg";
import {ReactComponent as AlignCenter}  from "../../assets/align-center.svg";
import {ReactComponent as AlignRight}  from "../../assets/align-right.svg";

import { fabric } from "fabric";

import Slider from "../Slider";
import ColorPicker from "../ColorPicker";
import ToggleButton from "../ToggleButton";
import { rgbToHex } from "../../helpers/colorConverter";

const ToolbarText= ({toolbarStore, setToolbarStore}) => {

    const TextСonstants = {
    MIN_FONT_SIZE: 10,
    MAX_FONT_SIZE: 200,
    INIT_FONT_SIZE: 40,
    MIN_LINE_HEIGHT: 1,
    MAX_LINE_HEIGHT: 10,
    INIT_TEXT: "click to select",
    };

    const textStore = toolbarStore.textStore;

    //each text object has its own textstore?


  const setTextProperty = (key, value) => {
       let newStore = {...toolbarStore}
       newStore.textStore[key] = value;
       setToolbarStore(newStore)
  }

    const addText = () => {
        let text = new fabric.IText('Type your text here', {
            left: 50,
            top: 50,
            fontFamily: 'Arial',
            fontSize: textStore.fontSize,
            // fill: '#000000',
            lineHeight: textStore.lineHeight,
            fontWeight: textStore.fontWeight,
            underline: textStore.underline,
            fontStyle: textStore.fontStyle,
            textAlign: textStore.textAlign,
            fill: textStore.fontColorCode,
            isBgTransparent: textStore.isBgTransparent,
            textBackgroundColor: textStore.bgColorCode,

        });
 
        setTextProperty("textObj", text )
    }

  const options = [
    {
      icon:  <Bold />,
      name: "fontWeight",
      handler: () => setTextProperty("fontWeight", textStore.fontWeight === "bold" ? "normal": "bold"),
      isActive: (fontWeight) => fontWeight === "bold",
    },
    {
      icon:  <Underline />,
      name: "underline",
      handler: () => setTextProperty("underline", !textStore.underline ),
      isActive: (isUnderlined) => isUnderlined,
    },
    {
      icon:  <Italic />,
      name: "fontStyle",
      handler: () => setTextProperty("fontStyle", textStore.fontStyle === "normal" ? "italic": "normal"),
      isActive: (fontStyle) => fontStyle === "italic",
    },
    {
      icon:  <AlignLeft />,
      name: "textAlign",
      handler: () => setTextProperty("textAlign", "left"),
      isActive: (textAlign) => textAlign === "left",
    },
    {
      icon:  <AlignCenter />,
      name: "textAlign",
      handler: () => setTextProperty("textAlign", "center"),
      isActive: (textAlign) => textAlign === "center",
    },
    {
      icon:  <AlignRight />,
      name: "textAlign",
      handler: () => setTextProperty("textAlign", "right"),
      isActive: (textAlign) => textAlign === "right",
    },
  ];
  return (
    <div className="toolbar__content">
      <button
        onClick={addText}
        className="toolbar__action-btn"
      >
        Add Text
      </button>
        <div className="toolbar__options toolbar__options_three-col">
          {options.map((option, index) => {
            const optionValue = textStore[option.name];
            return (
              <div
                key={index}
                className={`toolbar__option ${
                  option.isActive(optionValue) ? "toolbar__option_active" : ""
                }`}
                onClick={option.handler}
              >
                {option.icon}
              </div>
            );
          })}
        </div>
        <Slider
          title="Size"
          value={Math.floor(textStore.fontSize)}
          min={TextСonstants.MIN_FONT_SIZE}
          max={TextСonstants.MAX_FONT_SIZE}
          callback={value => {
           setTextProperty('fontSize', value);
          }}
        />
        <Slider
          title="Line height"
          value={textStore.lineHeight}
          min={TextСonstants.MIN_LINE_HEIGHT}
          max={TextСonstants.MAX_LINE_HEIGHT}
          callback={value => setTextProperty("lineHeight", value)}
        />
        <ColorPicker
          title="Colors"
          currentColorCode={textStore.fontColorCode}
          callback={rgbCode => setTextProperty("fontColorCode",  `rgb(${rgbCode})`)}
        />
        <ToggleButton
          title="Background"
          checked={!textStore.isBgTransparent}
          callback={() =>setTextProperty("isBgTransparent", !textStore.isBgTransparent)}
        />
        {!textStore.isBgTransparent && (
          <ColorPicker
            currentColorCode={textStore.bgColorCode}
            callback={rgbCode => setTextProperty("bgColorCode", `rgb(${rgbCode})`)}
          />
        )}
        {/* <button
          className="toolbar__action-btn"
          onClick={() => objectManagerStore.deleteSelectedObject()}
        >
          Remove
        </button> */}
    </div>
  );
};

export default ToolbarText;