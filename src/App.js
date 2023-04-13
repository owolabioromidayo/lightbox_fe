import Canvas from "./components/Canvas";
import { Flex, Spacer } from '@chakra-ui/react'
import './App.css';
import { useState, useEffect, useRef } from "react";
import Header from "./components/Header/Header";
import Toolbar from "./components/Toolbar/Toolbar";
import { fabric } from "fabric";
import Sidebar from "./components/Sidebar/Sidebar";
import ImageCropper from "./components/ImageCropper";

function App() {

  const [imageUrl, setImageUrl]  = useState(null);
  const [selectedImageUrl, setSelectedImageUrl] = useState("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAZAAAAGQCAYAAACAvzbMAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAALEwAACxMBAJqcGAAAAVRJREFUeJzt3D1vgkAABdC6xI0iChIB0q3jgBKc8Bv19waE4Cg4ONi4mhhm8A4GFm4FxgSbDlF0Tsc8f1+A2QhezPgV+sx77Gnmu9Ve1rn79tLr7rvc0Y+OBzjKvPNhD5AN7Vq3qejhw9vcVNG36DWjRvxR+bctYk2+vW7VjTYlOGODPq7q5q5pc1Vb+tZjJNnR7Y1Y2FyPD7JyNz52FzOHNns0VF0PTl9f1tXr1t7gY+FWrpP0o+uHd4fj/Ts86g4WucX8Hv/R/qGjTuSAAAAAElFTkSuQmCC");
  const [responseImageUrls, setResponseImageUrls]  = useState([]);
  const [selectedImageDetails, setSelectedImageDetails] = useState({x:0, y:0});

  const [cropMode, setCropMode] = useState(false);

  const canvasRef = useRef(null);
  const [canvas, setCanvas] = useState(null);
  const [history, setHistory] = useState([]);

  const [toolbarStore, setToolbarStore] = useState({
    isDrawingMode: false,
    // isTextMode: false,
    drawingStore: {
      lineWidth: 100,
      opacity: 1,
      colorCode: "#000000",
      // isLineStraight: false
    },
    effectsStore : {
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
    },
    textStore: {}
  })


//not working yet
function handleUndo() {
  if (history.length > 1) {
    const newHistory = history.slice(0, history.length - 1);
    setHistory(newHistory);
    const lastCanvasJSON = newHistory[newHistory.length - 1];
    const newCanvas = new fabric.Canvas('canvas');
    newCanvas.loadFromJSON(lastCanvasJSON, () => {
      canvas.clear();
      canvas.loadFromJSON(lastCanvasJSON, () => {
        canvas.renderAll();
      });
    });
  }
}

function handleRedo() {
  if (history.length < 2) {
    return;
  }
  const newHistory = [...history, history[history.length - 1]];
  setHistory(newHistory);
  const lastCanvasJSON = newHistory[newHistory.length - 1];
  const newCanvas = new fabric.Canvas('canvas');
  newCanvas.loadFromJSON(lastCanvasJSON, () => {
    canvas.clear();
    canvas.loadFromJSON(lastCanvasJSON, () => {
      canvas.renderAll();
    });
  });
}

  const handleCanvasChange = () => {
    // if (canvas){
      // console.log("IN canvas change");
      // let newCanvasJSON = canvas.toJSON();
      // const newHistory = [...history, newCanvasJSON];
      // console.log(newHistory);
      // setHistory(newHistory);
    // }
  }


  useEffect(() => {
    let container = canvasRef.current.parentNode
    let newCanvas = new fabric.Canvas(canvasRef.current, {
              height: container.offsetHeight,
              width: container.offsetWidth,
              // height: 700,
              // width: 700,
              backgroundColor: '#d8d2db',
              isDrawingMode: false,
              freeDrawingBrush: {
                  color: "black",
                  lineWidth: 10
               }
          }) 


    //   window.addEventListener('keydown', function(e) {
    //   if (e.key === "Delete") { 
    //     let activeObject = newCanvas.getActiveObject();
    //     if (activeObject) {
    //       console.log(activeObject)
    //       //TODO: history record
    //       newCanvas.remove(activeObject);
    //     }
    //   }
    // });

    setCanvas(newCanvas);
    setHistory([newCanvas.toJSON()]);
  }, []);


  useEffect(() => {
    // if (canvas) {
    //         console.log('Registering event listeners...');
    //   canvas.on('object:added', handleCanvasChange);
    //   canvas.on('object:moved', handleCanvasChange);
    //   return () => {
    //         console.log('Removing event listeners...');
    //     canvas.off('object:added', handleCanvasChange);
    //     canvas.off('object:moved', handleCanvasChange);
    //   };
    // }
  }, [canvas]);

  useEffect(() => {
    if(canvas){
      // console.log(toolbarStore)
      // const newCanvas =  new fabric.Canvas(canvasRef.current);

      let drawingProperties = toolbarStore.drawingStore;
      let effects= toolbarStore.effectsStore;
      let textStore= toolbarStore.textStore;


      let filters = [
        new fabric.Image.filters.Brightness({ brightness: effects.brightness }),
        new fabric.Image.filters.Contrast({ contrast: effects.contrast}),
        new fabric.Image.filters.Saturation({ saturation: effects.saturation }),
        // new fabric.Image.filters.Tint({ color: effects.tintColor, opacity: effects.tintOpacity }),
        new fabric.Image.filters.Invert({ invert: effects.invert }),
        new fabric.Image.filters.HueRotation({ rotation: effects.hue}),
        new fabric.Image.filters.Noise({ noise: effects.noise}),
        new fabric.Image.filters.Blur({ blur: effects.blur }),
        new fabric.Image.filters.Pixelate({ blocksize: effects.pixelate})
      ];


      //other toolbar change settings here
      setCanvas(canvas => {

        canvas.isDrawingMode = toolbarStore.isDrawingMode;
        canvas.selection = toolbarStore.isSelectionMode;
        
        canvas.freeDrawingBrush.color = drawingProperties.colorCode;
        canvas.freeDrawingBrush.width = drawingProperties.lineWidth;
        canvas.freeDrawingBrush.opacity = drawingProperties.opacity;
        // canvas.freeDrawingBrush.straight = drawingProperties.isLineStraight;

        canvas.backgroundImageFilters = filters;
        // canvas.renderAll();
        canvas.setBackgroundImage(canvas.toDataURL(), canvas.renderAll.bind(canvas), {
          filters: filters
        });

       
        if (textStore.textObj){
          canvas.add(textStore.textObj)
          textStore.textObj = null;
        }

        return canvas;

      });

    }
  }, [toolbarStore])

  // useEffect( ()=> {
  //   setCanvas(() => {

  //     canvas.freeDrawingBrush.width = drawingStore.lineWidth;
  //     canvas.freeDrawingBrush.color = drawingStore.colorCode; 
  //   })
  // }, [drawingStore])

  return (
    <>
      <Header 
      imageUrl={imageUrl} 
      setImageUrl={setImageUrl} 
      canvas={canvas}
      handleUndo={handleUndo}
      handleRedo={handleRedo}
       />
    <Flex 
       direction={["column","column" , "row"]}
      // flexWrap={["wrap", "nowrap"]}
      // justifyContent={["center", "space-between"]}
      // alignItems={["center", "flex-start"]}
      // alignContent={["center", "stretch"]}
    
    >
      {/* <Flex direction="row"> */}
        <Toolbar 
          toolbarStore={toolbarStore} 
          setToolbarStore={setToolbarStore}
          setCropMode={setCropMode}
        />

        <Canvas 
         imageUrl={imageUrl} 
         canvas={canvas} 
         setCanvas={setCanvas} 
         canvasRef={canvasRef}
         setSelectedImageUrl={setSelectedImageUrl} 
         setSelectedImageDetails={setSelectedImageDetails}
         handleCanvasChange={handleCanvasChange}
         toolbarStore={toolbarStore}
         cropMode={cropMode}
         />

        {/* <ImageCropper /> */}

        <Sidebar 
          style={{width: "200px"}} 
          setResponseImageUrls={setResponseImageUrls} 
          responseImageUrls={responseImageUrls} 
          selectedImageUrl={selectedImageUrl}
          canvas={canvas} 
          setCanvas={setCanvas} 
          selectedImageDetails={selectedImageDetails}
          />
      {/* </Flex> */}
    </Flex>
    </>

  );
}

export default App;
