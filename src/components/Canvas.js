import React, { useRef, useState, useEffect } from "react";
import { fabric } from 'fabric';

import "../styles/Canvas.css";

const Canvas = ({imageUrl, 
                canvas,
                setCanvas, 
                setSelectedImageUrl, 
                setSelectedImageDetails, 
                canvasRef,
                toolbarStore,
                handleCanvasChange,
                cropMode
              }) => {

  const [isDrawing, setIsDrawing] = useState(false);

  let rect = null;
  // let container = null;
  // container = document.getElementById('canvas').getBoundingClientRect();

  let sX = 0;
  let sY = 0;

  // let canva = null;


// useEffect(() => {
//   container = document.getElementById('canvas').getBoundingClientRect();},
//    [])
  // useEffect(() => {
  //   if (canvasRef.current) {
  //     const canvas = canvasRef.current;
  //     canvas.setDimensions(canvasSize);
  //     canvas.renderAll();
  //   }
  // }, [canvasSize]);

  // const [canvas, setCanvas] = useState(new fabric.Canvas("canvas"));

  //  useEffect(() => {
  //   const canvas = new fabric.Canvas(canvasRef.current);
  //   const resizeCanvas = () => {
  //     const container = canvasRef.current.parentNode;
  //     setCanvasSize({ width: container.offsetWidth, height: container.offsetHeight });
  //   };
  //   window.addEventListener('resize', resizeCanvas);
  //   resizeCanvas();
  //   return () => {
  //     window.removeEventListener('resize', resizeCanvas);
  //   };
  // }, []);

  // useEffect(() => {
  //   if (canvasRef.current) {
  //     const canvas = canvasRef.current;
  //     canvas.setDimensions(canvasSize);
  //     canvas.renderAll();
  //   }
  // }, [canvasSize]);

  // // useEffect(() => {
  // //   console.log("Canvas ref ", canvasRef)
  // //   if (canvasRef.current) {

  // //     const canvas = canvasRef.current;
  // //     console.log("Canvas size " , canvasSize)
  // //     // const container = canvasRef.current.parentNode;
  // //     // setCanvasSize({ width: container.offsetWidth, height: container.offsetHeight });
  // //     canvas.setDimensions(canvasSize);
  // //     canvas.renderAll();
  // //   }
  // // }, [canvasSize]);

  const handleMouseUp = () => {
    // const rect = canvas.getObjects()[0];
    // if (!toolbarStore.isDrawingMode){
        setIsDrawing(false);
        canvas.off('mouse:move', handleMouseMove);
        canvas.on('mouse:down', handleMouseDown);
    // }

    // Get cropped image data as base64
    const croppedImageDataUrl = cropImage(canvas, rect);

    //send over the network, some axios shit here
    // setImageDataUrl(croppedImageDataUrl);

    // rect = null;
    // canva.remove(rect);
    // console.log(rect, startX, startY)
  };

  const handleMouseMove = e => {
    // if (!isDrawing) return;
    if (!toolbarStore.isDrawingMode && !isDrawing){
      const width = e.e.pageX - sX;
      const height = e.e.pageY - sY;
      rect.set({width: width, height: height})
      console.log(width, height)
      rect.setCoords();
      canvas.renderAll();
    }
  };
  
  const handleMouseDown = e => {
      setIsDrawing(true);
      // console.log(e);

      const canv = canvasRef.current;
      const container = canv.getBoundingClientRect();
      sX = e.e.pageX - container.left;
      sY = e.e.pageY - container.top;

      console.log("Mouse down at:", sX , sY);

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

      canvas.on('mouse:move', handleMouseMove);
      canvas.off('mouse:down', handleMouseDown);
  };



    const cropImage = (canvas, rect) => {
    // Get crop rectangle coordinates
    const cropRect = rect.getBoundingRect();
    const left = cropRect.left - 30;
    const top = cropRect.top - 30;
    // const width = cropRect.width -10;
    // const height = cropRect.height - 10;

    console.log(cropRect)

    const width = 512
    const height = 512

    // const width = 200 
    // const height = 200 
    // Create cropped canvas and image

    const croppedImageDataUrl = canvas.toDataURL({
        left: left,
        top: top,
        width: width,
        height: height,
        scaleX: 1 / canvas.getZoom(),
        scaleY: 1 / canvas.getZoom(),
      })

    if (cropMode){
      setSelectedImageDetails({x: left, y: top})
      // setImageDataUrl(croppedImageDataUrl);
      setSelectedImageUrl(croppedImageDataUrl);
    }
    


// console.log(left, top, width, height, )

return croppedImageDataUrl;

};


  useEffect(() => {
    if (imageUrl === null){
        return;
    }

    if(typeof(imageUrl) == 'string'){
      fabric.Image.fromURL(imageUrl, function(oImg) {
          const container = canvasRef.current.parentNode;

          // let newCanv = new fabric.Canvas(canvasRef.current, {
          //     height: container.offsetHeight,
          //     width: container.offsetWidth,
          //     backgroundColor: '#d8d2db',
          //     isDrawingMode: false,
          //     freeDrawingBrush: {
          //         color: "black",
          //         lineWidth: 10
          //   }
          // });

          // console.log(canvasRef.current);

          // console.log(canvasSize.width, canvasSize.height);
          oImg.scaleToHeight(container.offsetHeight / 2);
          oImg.scaleToWidth(container.offsetWidth/ 2);
          oImg.selectable = true;

          let newCanv = canvas.add(oImg).renderAll();


          newCanv.on('mouse:down', handleMouseDown);
          newCanv.on('mouse:up', handleMouseUp);
          
          setCanvas(newCanv);
          // canva = newCanv;
          // setCanvasSize({width: newCanv.width, height: newCanv.height})

            //   const resizeCanvas = () => {
            //     const container = canvasRef.current.parentNode;
            //     setCanvasSize({ width: container.offsetWidth, height: container.offsetHeight });
            //     console.log(container.offsetWidth, container.offsetHeight)
            //    };
            // window.addEventListener('resize', resizeCanvas);
            // resizeCanvas();
            // return () => {
            //   window.removeEventListener('resize', resizeCanvas);
            // };
      });
    }

  }, [imageUrl])

  return(
    <div style= {{
            // border : "10px black solid",
            width: "70%",
            margin: "10px 0 0 20px",
            height: "90vh",
        }} className="_canvas">
      <canvas ref={canvasRef} id="canvas" />
      
      {/* {imageDataUrl && <img src={imageDataUrl} />} */}
    </div>
  );
};



export default Canvas;