import React from "react";
// import { CSSTransition, TransitionGroup } from "react-transition-group";

// import {ReactComponent as Close}  from "../../assets/close.svg";
import {ReactComponent as Crop}  from "../../assets/crop.svg";
import {ReactComponent as Pencil}  from "../../assets/pencil.svg";
import {ReactComponent as Adjust}  from "../../assets/adjust.svg";
import {ReactComponent as Text}  from "../../assets/text.svg";
import {ReactComponent as Pointer}  from "../../assets/pointer.svg";
import {ReactComponent as Eraser}  from "../../assets/eraser.svg";

import { useState } from "react";

import ToolbarDrawing from "./ToolbarDrawing";
import ToolbarText from "./ToolbarText";
import ToolbarEffects from "./ToolbarEffects";


import "../../styles/Toolbar.css";

const Toolbar = ({toolbarStore, setToolbarStore, setCropMode, clearCanvasBackground, saveEffectsImage}) => {

    const [settingChoice, setSettingChoice] = useState("");

    const setShowSettings = (choice) => {
        if (settingChoice != "crop"){
            setCropMode(false);
        }

        if (settingChoice === choice){
            setSettingChoice("")
        }else{
            setSettingChoice(choice);
        }

    }

    //select and deselect are different things. need to cater to that or BUGS
    const handleCropClick = () => {
        setCropMode(true);
        setShowSettings("crop");
        setToolbarStore({...toolbarStore, isSelectionMode: true, isDrawingMode: false})
    }
    const handlePointerClick = () => {
        setToolbarStore({...toolbarStore, isDrawingMode: false, isSelectionMode: true})
        setShowSettings("pointer");
    }

    const handlePencilClick = () => {
        setToolbarStore({...toolbarStore, isDrawingMode: true, isSelectionMode: false, 
        drawingStore: {...toolbarStore.drawingStore, isErasing: false}})
        setShowSettings("drawing")
        //something for drawing option modal
    }

    const handleEraserClick = () => {
        setToolbarStore({...toolbarStore, isDrawingMode: true, isSelectionMode: false, 
        drawingStore: {...toolbarStore.drawingStore, isErasing: true}})
        setShowSettings("erasing")
        //something for drawing option modal
    }

    return (
        <div className="toolbar_parent">
        <div class="toolbar">
                <div onClick={handlePointerClick}>
                    <Pointer 
                    className={`toolbar__icon toolbar__top_icon ${settingChoice == "pointer" ? "toolbar__icon_active" : ""}`}/>
                </div>
                {/* <div onClick={handleCropClick}>
                    <Crop 
                    className={`toolbar__icon ${settingChoice == "crop" ? "toolbar__icon_active" : ""}`}/>
                </div> */}
                <div onClick={handlePencilClick}>
                    <Pencil 
                    className={`toolbar__icon ${settingChoice == "drawing" ? "toolbar__icon_active" : ""}`}/>
                </div>
                <div onClick={handleEraserClick}>
                    <Eraser 
                    className={`toolbar__icon ${settingChoice == "erasing" ? "toolbar__icon_active" : ""}`}/>
                </div>
                <div onClick={() => setShowSettings("effects")}>
                    <Adjust 
                    className={`toolbar__icon ${settingChoice == "effects" ? "toolbar__icon_active" : ""}`}/>
                </div>
                <div onClick={() => setShowSettings("text")}>
                    <Text 
                    className={`toolbar__icon toolbar__bottom_icon ${settingChoice == "text" ? "toolbar__icon_active" : ""}`}/>
                </div>
        </div>

        {
        settingChoice == "text" ?
         <ToolbarText toolbarStore={toolbarStore} setToolbarStore={setToolbarStore} /> :
        settingChoice == "drawing" ?
        <ToolbarDrawing toolbarStore={toolbarStore} setToolbarStore={setToolbarStore} />:
        settingChoice == "effects" ?
        <ToolbarEffects toolbarStore={toolbarStore} setToolbarStore={setToolbarStore} 
            clearCanvasBackground={clearCanvasBackground} saveEffectsImage={saveEffectsImage} /> :
         <></>  }
        </div>
    )
};

export default Toolbar;