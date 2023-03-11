import React, { useEffect, useState } from 'react';
import { fabric } from 'fabric';

function ImageCropper() {
  const [imageDataUrl, setImageDataUrl] = useState(null);
  let canvas = null;
  let container = null 
  
  let rect = null;

  const [isDrawing, setIsDrawing] = useState(false);

  let sX = 0;
  let sY = 0;

  const handleFileChange = e => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        canvas = new fabric.Canvas('canvas');
        const fabricImg = new fabric.Image(img);
        fabricImg.selectable = false;

        // Set canvas dimensions to image dimensions
        canvas.setWidth(img.width);
        canvas.setHeight(img.height);

        // Add image to canvas and render
        canvas.add(fabricImg).renderAll();
        canvas.on('mouse:down', handleMouseDown);
        canvas.on('mouse:up', handleMouseUp);
      };

      img.src = reader.result;
    };

    reader.readAsDataURL(file);
  };

  const handleMouseDown = e => {
    setIsDrawing(true);
    console.log(e);
    let sX = container.left;
    let sY = container.top;
    console.log(sX, sY)
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
      mtr: false,
      bl: false,
      br: false,
      tl: false,
      tr: false,
    });
    rect.setCoords();
    canvas.on('mouse:move', handleMouseMove);
    canvas.off('mouse:down', handleMouseDown);
  };

  const handleMouseMove = e => {
    // if (!isDrawing) return;
    const width = e.e.pageX - sX;
    const height = e.e.pageY - sY;
    rect.set({width: width, height: height})
    rect.setCoords();
    canvas.renderAll();
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
    // const rect = canvas.getObjects()[0];
    canvas.off('mouse:move', handleMouseMove);
    canvas.on('mouse:down', handleMouseDown);

    // Get cropped image data as base64
    const croppedImageDataUrl = cropImage(canvas, rect);

    //send over the network, some axios shit here
    setImageDataUrl(croppedImageDataUrl);

    rect = null;
    canvas.remove(rect);
    // console.log(rect, startX, startY)
  };

  const cropImage = (canvas, rect) => {
    // Get crop rectangle coordinates
    const cropRect = rect.getBoundingRect();
    const left = cropRect.left;
    const top = cropRect.top;
    // const width = cropRect.width;
    // const height = cropRect.height;

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



console.log(left, top, width, height, )

return croppedImageDataUrl;

};

useEffect(() => {container = document.getElementById('canvas').getBoundingClientRect();}, [])
return (
<div>
<input type="file" onChange={handleFileChange} />
<canvas id="canvas" />
{/* <button onClick={() => canvas.zoomToPoint({ x: 0, y: 0 }, 1)}>Reset Zoom</button>
<button onClick={() => canvas.zoomToPoint({ x: 0, y: 0 }, canvas.getZoom() * 1.1)}>Zoom In</button>
<button onClick={() => canvas.zoomToPoint({ x: 0, y: 0 }, canvas.getZoom() / 1.1)}>Zoom Out</button> */}
<br />
{imageDataUrl && <img src={imageDataUrl} />}

</div>
);
}

export default ImageCropper;