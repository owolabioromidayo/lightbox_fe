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
// import ToolbarText from "./ToolbarText";
// import ToolbarEffects from "./ToolbarEffects";


import "../../styles/Toolbar.css";
import ToolbarEffects from "./ToolbarEffects";

const Toolbar = ({toolbarStore, setToolbarStore}) => {
//   const contentMap: {[name: string]: JSX.Element} = {
//     crop: <ToolbarCrop />,
//     adjust: <ToolbarRotate />,
//     drawing: <ToolbarDrawing />,
//     text: <ToolbarText />,
//     effects: <ToolbarEffects />,
//   };

    // const [showSettings, setShowSettings] = useState({
    //     effects : false
    // })

    const [showEffects, setShowEffects] = useState(false);
    const [showDrawing, setShowDrawing] = useState(false);
//   return useObserver(() => (
//     <TransitionGroup component={null}>
//       {UIStore.isToolbarOpen && (
//         <CSSTransition
//           timeout={600}
//           classNames="toolbar"
//         >
//           <section className={`toolbar custom-scrollbar`}>
//             <div className="toolbar__header">
//               <h4 className="toolbar__title">{canvasStore.mode}</h4>
//               <Close onClick={() => {
//                 canvasStore.resetToBaseScale();
//                 UIStore.closeToolbar();
//               }}/>
//             </div>
//             {contentMap[canvasStore.mode]}
//           </section>
//         </CSSTransition>
//       )}
//     </TransitionGroup>
//   ));

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
        setShowEffects(false);
        setShowDrawing(false);

        switch (choice){
            case "effects":
                setShowEffects(!showEffects);
            case "drawing":
                setShowDrawing(!showDrawing);
        }

    }
    const handlePointerClick = () => {
        setToolbarStore({...toolbarStore, isDrawingMode: false})
    }

    const handlePencilClick = () => {
        setToolbarStore({...toolbarStore, isDrawingMode: true})
        setShowSettings("drawing")
        //something for drawing option modal
    }

    return (
        <div className="toolbar_parent">
            {/* <Flex backgroundColor="#0f0e0e" direction="column" >  */}
                {/* <Crop width="40px" height="20px" style={{color: "white"}} className="icon" />
                <Pencil width="40px" height="40px" />
                <Adjust width="40px" height="40px" />
                <Text width="40px" height="40px" /> */}
                {/* <ToolbarDrawing drawingStore={drawingStore} setDrawingStore={setDrawingStore}/> */}
                {/* <ToolbarText /> */}
                {/* <ToolbarEffects /> */}

        <div class="toolbar">
                <div onClick={handlePointerClick}>
                    <Pointer className="toolbar__icon toolbar__top_icon"/>
                </div>
                <Crop className="toolbar__icon " />
                <div onClick={handlePencilClick}>
                    <Pencil className="toolbar__icon"/>
                </div>
                <div onClick={() => setShowSettings("effects")}>
                    <Adjust className="toolbar__icon"/>
                </div>
                <Text className="toolbar__icon toolbar__bottom_icon"/>
        </div>

        { showEffects && <ToolbarEffects toolbarStore={toolbarStore} setToolbarStore={setToolbarStore} />}
        { showDrawing && <ToolbarDrawing toolbarStore={toolbarStore} setToolbarStore={setToolbarStore} />}
        </div>
    )
};

export default Toolbar;