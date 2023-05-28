import Canvas from "./components/Canvas";
import { Flex, Spacer } from '@chakra-ui/react'
import './App.css';
import { useState, useEffect, useRef } from "react";
import Header from "./components/Header/Header";
import Toolbar from "./components/Toolbar/Toolbar";
import { fabric } from "fabric";
import Sidebar from "./components/Sidebar/Sidebar";

import { hexToRgb } from "./helpers/colorConverter";

function App() {

  const [imageUrl, setImageUrl]  = useState(null);
  const [selectedImageUrl, setSelectedImageUrl] = useState("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAZAAAAGQCAYAAACAvzbMAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAALEwAACxMBAJqcGAAAAVRJREFUeJzt3D1vgkAABdC6xI0iChIB0q3jgBKc8Bv19waE4Cg4ONi4mhhm8A4GFm4FxgSbDlF0Tsc8f1+A2QhezPgV+sx77Gnmu9Ve1rn79tLr7rvc0Y+OBzjKvPNhD5AN7Vq3qejhw9vcVNG36DWjRvxR+bctYk2+vW7VjTYlOGODPq7q5q5pc1Vb+tZjJNnR7Y1Y2FyPD7JyNz52FzOHNns0VF0PTl9f1tXr1t7gY+FWrpP0o+uHd4fj/Ts86g4WucX8Hv/R/qGjTuSAAAAAElFTkSuQmCC");
  const [responseImageUrls, setResponseImageUrls]  = useState([]);
  const [selectedImageDetails, setSelectedImageDetails] = useState({x:0, y:0});

  const [cropMode, setCropMode] = useState(false);

  const canvasRef = useRef(null);
  const [canvas, setCanvas] = useState(null);

  // const [history, setHistory] = useState([]);
  

  const [isDrawing, setIsDrawing] = useState(false);

  let tCount = 0;

  let rect = null;
  let sX = 0;
  let sY = 0;


  let historyUndo = useRef([]);
  let historyRedo = useRef([]);

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
    textStore: { 
      fontSize: 12, 
      lineHeight: 1,
      fontWeight: "normal",
      underline: false,
      fontStyle: "normal",
      textAlign: "center",
      fontColorCode: "rgb(0,0,0)",
      isBgTransparent: true,
      bgColorCode: "rgb(255,255,255)"

    }
  })
  


function saveEffectsImage(){
    let effects= toolbarStore.effectsStore;
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

      if (canvas){
        fabric.Image.fromURL(canvas.toDataURL() , (img) => {

          for(let filter of filters){
            img.filters.push(filter)
          }

          img.applyFilters();

          var image = new Image();
          image.src = img.toDataURL();

          let w = window.open("",'_blank');
          w.document.write(image.outerHTML);
          w.document.close(); 
        }) ;
    }
     
  

}

  function handleUndo() {
    console.log('undo: ', historyUndo.current)
    if (historyUndo.current.length < 1) {
      return
    }
    // let container = canvasRef.current.parentNode

    let history = historyUndo.current.pop();      
    historyRedo.current.push(history)

    let newCanvas = new fabric.Canvas(canvasRef.current) 
    newCanvas.loadFromJSON(history, () => {
        newCanvas.renderAll()
        tCount =  0;
        // canvas.dispose();
        setCanvas(newCanvas)
    });
    // let newCanvas = new fabric.Canvas(canvasRef.current, {
    //           height: container.offsetHeight,
    //           width: container.offsetWidth,
    //           backgroundColor: 'white',
    //           isDrawingMode: false
    //       }) 
    // setCanvas((canvas) => {
    //   // canvas.clear()
    //   // canvas.dispose()
    //   canvas.loadFromJSON(history, () => {
    //   });
    //   canvas.renderAll()
    //   return canvas
    // })
    // setCanvas(newCanvas)
  }

  
  function handleRedo() {
    console.log('redo: ', historyRedo.current)
    if (historyRedo.current.length < 1) {
      return;
    }
    
    // let container = canvasRef.current.parentNode
    let history = historyRedo.current.pop();      
    historyUndo.current.push(canvas.toJSON())

    // const newHistory = [...history, history[history.length - 1]];
    // setHistory(newHistory);
    // const lastCanvasJSON = newHistory[newHistory.length - 1];
    // let newCanvas = new fabric.Canvas(canvasRef.current) 
    // newCanvas.loadFromJSON(history, () => {
    //     newCanvas.renderAll()
    //     setCanvas(newCanvas)
    // });
  }

  const handleCanvasChange = () => {
    // if (canvas){
      historyUndo.current.push(canvas.toJSON())
      
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
    
    // if (cropMode){
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

    window.addEventListener('keydown', function(e) {
        if (e.key === "Delete") { 
         
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
      });

    // _setCanvas(newCanvas);
    setCanvas(newCanvas);
    // setHistory([newCanvas.toJSON()]);
  }, []);


  useEffect(() => {

    if (canvas != null && tCount == 0){
      canvas.on('mouse:down', handleMouseDown);
      canvas.on('mouse:up', handleMouseUp);

      canvas.on('object:added', handleCanvasChange)
      canvas.on('object:removed', handleCanvasChange)
      // canvas.on('object:modified', handleCanvasChange)
      // canvas.on('object:skewing', handleCanvasChange)

      canvas.on('path:created', (event) => {
      setCanvas(() => {
        let item = event.path;
        item.selectable = false;
        canvas.add(item);

        console.log("path created")

        return canvas
      })
    });

    tCount++; 
    }
    
  },[canvas])


  // useEffect(() => {
  //   if(canvas){
  //     canvas.renderAll()
  //   }
  // }, [canvas]);

  useEffect(() => {
    if(canvas){
      // console.log(toolbarStore)
      // const newCanvas =  new fabric.Canvas(canvasRef.current);

      let drawingProperties = toolbarStore.drawingStore;
      let textStore= toolbarStore.textStore;


      //other toolbar change settings here
      setCanvas(canvas => {

        canvas.isDrawingMode = toolbarStore.isDrawingMode;
        canvas.selection = toolbarStore.isSelectionMode;
              
        canvas.freeDrawingBrush.color = `rgba(${hexToRgb(drawingProperties.colorCode)}, ${drawingProperties.opacity})`;
        canvas.freeDrawingBrush.width = drawingProperties.lineWidth;

        if (toolbarStore.drawingStore.isErasing){

          canvas.freeDrawingBrush.color = '#ffffff';
          canvas.freeDrawingBrush.width = drawingProperties.lineWidth;
          canvas.freeDrawingBrush.opacity = drawingProperties.opacity;
        }
        canvas.freeDrawingBrush.straight = drawingProperties.isLineStraight;
       
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
    
    >
        <Toolbar 
          toolbarStore={toolbarStore} 
          setToolbarStore={setToolbarStore}
          setCropMode={setCropMode}
          saveEffectsImage={saveEffectsImage}
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
    </Flex>
    </>

  );

}

export default App;
