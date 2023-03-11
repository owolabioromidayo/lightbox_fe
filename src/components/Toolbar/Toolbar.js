import React from "react";
// import { CSSTransition, TransitionGroup } from "react-transition-group";

// import {ReactComponent as Close}  from "../../assets/close.svg";
import {ReactComponent as Crop}  from "../../assets/crop.svg";
import {ReactComponent as Pencil}  from "../../assets/pencil.svg";
import {ReactComponent as Adjust}  from "../../assets/adjust.svg";
import {ReactComponent as Text}  from "../../assets/text.svg";
import {ReactComponent as Pointer}  from "../../assets/pointer.svg";

import { useState } from "react";

import { Flex, Center } from "@chakra-ui/react";
import ToolbarDrawing from "./ToolbarDrawing";
import ToolbarText from "./ToolbarText";
import ToolbarEffects from "./ToolbarEffects";


import "../../styles/Toolbar.css";

const Toolbar = ({toolbarStore, setToolbarStore, setCropMode}) => {
    // const [showSettings, setShowSettings] = useState({
    //     effects : false
    // })

    const [showEffects, setShowEffects] = useState(false);
    const [showDrawing, setShowDrawing] = useState(false);
    const [showText, setShowText] = useState(false);

    const [settingChoice, setSettingChoice] = useState("");
// 

    // const handleSettingsClick = (keyToSetTrue) => {
    //     // setShowSettings((settings) => {

    //     //     for (const key in settings){
    //     //         if(key == keyToSetTrue){
    //     //             settings[key] = !settings[key];
    //     //         }else{
    //     //             settings[key] = false; 
    //     //         }

    //     //     }
    //     //     console.log(settings)
    //     //     return settings;
    //     // } )

    //     setShowEffects(!showEffects)
    // }

    const setShowSettings = (choice) => {
        //make everything false
        // setShowEffects(false);
        // setShowDrawing(false);
        // setShowText(false);

        // switch (choice){
        //     case "effects":
        //         setShowEffects(!showEffects);
        //     case "drawing":
        //         setShowDrawing(!showDrawing);
        //     case "text":
        //         setShowText(!showText);

        if (settingChoice === choice){
            setSettingChoice("")
        }else{
            setSettingChoice(choice);
        }

    }

    const handleCropClick = () => {
        setCropMode(cp => !cp);
        setShowSettings("crop");
        setToolbarStore({...toolbarStore, 
            isSelectionMode: !toolbarStore.isSelectionMode, isDrawingMode: false})
    }
    const handlePointerClick = () => {
        setToolbarStore({...toolbarStore, isDrawingMode: false, isSelectionMode: true})
        setShowSettings("pointer");
    }

    const handlePencilClick = () => {
        setToolbarStore({...toolbarStore, isDrawingMode: !toolbarStore.isDrawingMode, isSelectionMode: false})
        setShowSettings("drawing")
        //something for drawing option modal
    }

    return (
        <div className="toolbar_parent">
        <div class="toolbar">
                <div onClick={handlePointerClick}>
                    <Pointer 
                    className={`toolbar__icon toolbar__top_icon ${settingChoice == "pointer" ? "toolbar__icon_active" : ""}`}/>
                </div>
                <div onClick={handleCropClick}>
                    <Crop 
                    className={`toolbar__icon ${settingChoice == "crop" ? "toolbar__icon_active" : ""}`}/>
                </div>
                <div onClick={handlePencilClick}>
                    <Pencil 
                    className={`toolbar__icon ${settingChoice == "drawing" ? "toolbar__icon_active" : ""}`}/>
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

        {/* { showEffects && <ToolbarEffects toolbarStore={toolbarStore} setToolbarStore={setToolbarStore} />}
        { showDrawing && <ToolbarDrawing toolbarStore={toolbarStore} setToolbarStore={setToolbarStore} />}
        { showText && <ToolbarText toolbarStore={toolbarStore} setToolbarStore={setToolbarStore} />} */}

        {/* {() => {switch(settingChoice){
            case "":
                return <></>
            case "text":
                return <ToolbarText toolbarStore={toolbarStore} setToolbarStore={setToolbarStore} />
            case "drawing":
                return <ToolbarDrawing toolbarStore={toolbarStore} setToolbarStore={setToolbarStore} />
            case "effects":
                return <ToolbarEffects toolbarStore={toolbarStore} setToolbarStore={setToolbarStore} />

        }} } */}
        {
        settingChoice == "text" ?
         <ToolbarText toolbarStore={toolbarStore} setToolbarStore={setToolbarStore} /> :
        settingChoice == "drawing" ?
        <ToolbarDrawing toolbarStore={toolbarStore} setToolbarStore={setToolbarStore} />:
        settingChoice == "effects" ?
        <ToolbarEffects toolbarStore={toolbarStore} setToolbarStore={setToolbarStore} /> :
         <></>  }
        </div>
    )
};

export default Toolbar;