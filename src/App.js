import Canvas from "./components/Canvas";
import { Flex, Spacer } from '@chakra-ui/react'
import './App.css';
import { useState, useEffect, useRef } from "react";
import Header from "./components/Header/Header";
import Toolbar from "./components/Toolbar/Toolbar";
import { fabric } from "fabric";
import Sidebar from "./components/Sidebar/Sidebar";

function App() {

  const [imageUrl, setImageUrl]  = useState(null);
  const [selectedImageUrl, setSelectedImageUrl] = useState("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAZAAAAGQCAYAAACAvzbMAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAALEwAACxMBAJqcGAAAAVRJREFUeJzt3D1vgkAABdC6xI0iChIB0q3jgBKc8Bv19waE4Cg4ONi4mhhm8A4GFm4FxgSbDlF0Tsc8f1+A2QhezPgV+sx77Gnmu9Ve1rn79tLr7rvc0Y+OBzjKvPNhD5AN7Vq3qejhw9vcVNG36DWjRvxR+bctYk2+vW7VjTYlOGODPq7q5q5pc1Vb+tZjJNnR7Y1Y2FyPD7JyNz52FzOHNns0VF0PTl9f1tXr1t7gY+FWrpP0o+uHd4fj/Ts86g4WucX8Hv/R/qGjTuSAAAAAElFTkSuQmCC");
  const [responseImageUrls, setResponseImageUrls]  = useState([]);
  const [selectedImageDetails, setSelectedImageDetails] = useState({x:0, y:0});

  const [cropMode, setCropMode] = useState(false);

  const canvasRef = useRef(null);
  const [canvas, setCanvas] = useState(null);
  // const canvasStateRef  = useRef(canvas);

  // const _setCanvas = data => {
  //   canvasStateRef.current = data;
  //   // setCanvas(data)
  // } 

  const [history, setHistory] = useState([]);

  const [isDrawing, setIsDrawing] = useState(false);

  let tCount = 0;

  let rect = null;
  let sX = 0;
  let sY = 0;

  const [toolbarStore, setToolbarStore] = useState({
    isDrawingMode: false,
    isCroppingMode: false,
    // isTextMode: false,
    drawingStore: {
      lineWidth: 100,
      opacity: 1,
      colorCode: "#000000",
      isErasing: false
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

  
  const cropImage = (canvas, rect) => {
    // Get crop rectangle coordinates
    const cropRect = rect.getBoundingRect();
    const left = cropRect.left - 30;
    const top = cropRect.top - 30;
    // const width = cropRect.width -10;
    // const height = cropRect.height - 10;
    const width = 512
    const height = 512

    // Create cropped canvas and image
    const croppedImageDataUrl = canvas.toDataURL({
        left: left,
        top: top,
        width: width,
        height: height,
        scaleX: 1 / canvas.getZoom(),
        scaleY: 1 / canvas.getZoom(),
      })
    
    console.log(cropMode, "now??")
    // if (cropMode){
      console.log("finally")
      setSelectedImageDetails({x: left, y: top})
      setSelectedImageUrl(croppedImageDataUrl);
    // }
  };


  useEffect(() => {
    let container = canvasRef.current.parentNode
    let newCanvas = new fabric.Canvas(canvasRef.current, {
              height: container.offsetHeight,
              width: container.offsetWidth,
              backgroundColor: 'white',
              isDrawingMode: false
          }) 

    newCanvas.renderAll();
    // newCanvas.on('mouse:down', handleMouseDown(newCanvas));
    // newCanvas.on('mouse:up', handleMouseUp(newCanvas));

    // window.addEventListener('keydown', function(e) {
    //   if (e.key === "Delete") { 
    //     let activeObject = newCanvas.getActiveObject();
    //     if (activeObject) {
    //       //TODO: history record
    //       newCanvas.remove(activeObject);
    //     }
    //   }
    // });

    window.addEventListener('keydown', function(e) {
        if (e.key === "Delete") { 
          // console.log("Deleting")
          // const canv = canvasStateRef.current;
          // console.log(canv)

          // if (canv){
          //   console.log("Deleting actvie object")

          //   let activeObject = canv.getActiveObject();
          //   if (activeObject) {
          //     console.log("Deleting actvie2 object")
          //     //TODO: history record
              setCanvas( (canvas) => {

                console.log(canvas);
                console.log(typeof canvas);
                let activeObject = canvas.getActiveObject();
                if (activeObject){
                  canvas.remove(activeObject)
                  canvas.discardActiveObject().renderAll();
                }
                return canvas
              })
            }
            // setCanvas(canv);
        // }
        // }
      });

    // _setCanvas(newCanvas);
    setCanvas(newCanvas);
    setHistory([newCanvas.toJSON()]);
  }, []);


  useEffect(() => {
    // _setCanvas(canvas)

    if (canvas != null && tCount == 0){
      canvas.on('mouse:down', handleMouseDown);
      canvas.on('mouse:up', handleMouseUp);

      canvas.on('path:created', (event) => {
      setCanvas(() => {
        let item = event.path;
        item.selectable = false;
        canvas.add(item);
        // canvas.item(0).selectable = false;

        console.log("path created")

        //can do some history recording here
        return canvas
      })
    });

    }
    
  },[canvas])


  

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
      console.log("updaing canv")
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

        if (toolbarStore.drawingStore.isErasing){

          canvas.freeDrawingBrush.color = '#ffffff';
          canvas.freeDrawingBrush.width = drawingProperties.lineWidth;
          canvas.freeDrawingBrush.opacity = drawingProperties.opacity;
        }
        canvas.freeDrawingBrush.straight = drawingProperties.isLineStraight;

        // canvas.backgroundImageFilters = filters;
        // // canvas.renderAll();
        // canvas.setBackgroundImage(canvas.toDataURL(), canvas.renderAll.bind(canvas), {
        //   filters: filters
        // });

       
        if (textStore.textObj){
          canvas.add(textStore.textObj)
          textStore.textObj = null;
        }

        return canvas;

      });

    }
  }, [toolbarStore])




  const handleMouseUp = () => {
    // if (canvas){

    // const rect = canvas.getObjects()[0];
    // if (!toolbarStore.isCroppingMode){
        setIsDrawing(false);
        canvas.off('mouse:move', handleMouseMove);
      //  setTimeout(canvas.on('mouse:down', handleMouseDown), 200)
       canvas.on('mouse:down', handleMouseDown)
    // }
    console.log("Mouse up")
    console.log(rect)
     cropImage(canvas, rect);
    // }
  };

  const handleMouseMove = e => {
    if (isDrawing){
      const width = e.e.pageX - sX;
      const height = e.e.pageY - sY;
      rect.set({width: width, height: height})
      rect.setCoords();

      canvas.renderAll();
    }
  };
  
  const handleMouseDown = e => {
      setIsDrawing(true);
      
      const canv = canvasRef.current;
      const container = canv.getBoundingClientRect();
      sX = e.e.pageX - container.left;
      sY = e.e.pageY - container.top;


      rect = new fabric.Rect({
        left: sX,
        top: sY,
        width: 0,
        height: 0,
        fill: 'rgba(0, 0, 0, 0.5)',
        stroke: '#ccc',
        strokeWidth: 2,
        selectable: false,
      });
      rect.setControlsVisibility({
        mt: true,
        mb: true,
        ml: true,
        mr: true,
        tl: true,
        tr: true,
        bl: true,
        br: true,
        mtr: true
      });
      rect.setCoords();

      // if (canvas){
        // console.log("setting handlers")
        canvas.on('mouse:move', handleMouseMove);
        canvas.off('mouse:down', handleMouseDown);
      // }
  };


  useEffect(() => {
  
    if(typeof(imageUrl) == 'string'){
      fabric.Image.fromURL(imageUrl, function(oImg) {
          const container = canvasRef.current.parentNode;

          // console.log(canvasSize.width, canvasSize.height);
          oImg.scaleToHeight(container.offsetHeight / 2);
          oImg.scaleToWidth(container.offsetWidth/ 2);
          oImg.selectable = true;

          let newCanv = canvas.add(oImg).renderAll();


          // newCanv.on('mouse:down', handleMouseDown);
          // newCanv.on('mouse:up', handleMouseUp);
          // newCanv.on()
          
          setCanvas(newCanv);


          


      }
      );
    }

  }, [imageUrl])



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
        // style={{width:"90%"}}
         canvasRef={canvasRef}
         />

        <Sidebar 
          // style={{width: "200px"}} 
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
