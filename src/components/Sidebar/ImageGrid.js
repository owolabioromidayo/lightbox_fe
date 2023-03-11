import React from 'react';
import { fabric } from 'fabric';

import '../../styles/ImageGrid.css';

function ImageGrid({ imageUrls, canvas, selectedImageDetails, setCanvas }) {
    const handleClick = (url) => {

    fabric.Image.fromURL(url, function(oImg) {
        // const container = canvasRef.current.parentNode;

        // let newCanv = new fabric.Canvas(canvasRef.current, {
        //     height: container.offsetHeight,
        //     width: container.offsetWidth,
        //     backgroundColor: '#d8d2db',
        //     isDrawingMode: false,
        //     freeDrawingBrush: {
        //         color: "black",
        //         lineWidth: 10
        // }
        // });

        // // console.log(canvasSize.width, canvasSize.height);
        // oImg.scaleToHeight(container.offsetHeight);
        // oImg.scaleToWidth(container.offsetWidth);
        // oImg.selectable = false;
        // let newcanv = copy(canvas)
        // newcanv.add(oImg).renderAll();
        oImg.set({
            left: selectedImageDetails.x,
            top: selectedImageDetails.y,
            selectable: true, // make the image unselectable
        });

        setCanvas((canv) => {
            canv = canv.add(oImg)
            canv.renderAll()
            return canv
        });
    })
}
  return (
    <>
    <hr />
    <h2>Image Results</h2> 

    <div className="image-grid">
      {imageUrls.map((url, index) => (
        <img key={index} src={url} alt={`Image ${index}`} onClick={() => handleClick(url)} />
      ))}
    </div>
    </>
  );
}

export default ImageGrid;