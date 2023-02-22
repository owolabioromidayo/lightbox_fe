import React, { useRef, useState, useEffect } from "react";
import { fabric } from 'fabric';


const Canvas = ({imageUrl, canvas, setCanvas}) => {
  const initCanvas = () => (
    new fabric.Canvas('canvas', {
      height: 1080,
      width: 1920,
      backgroundColor: 'white'
    })
  )

  useEffect(() => {
    setCanvas(initCanvas());
  }, []);

  useEffect(() => {
    if (imageUrl === null){
        return;
    }

    if(typeof(imageUrl) == 'string'){
        console.log(imageUrl);
    
        fabric.Image.fromURL(imageUrl, function(oImg) {
            let newCanv = new fabric.Canvas('canvas', {
                height: oImg.height*2,
                width: oImg.width*2,
                backgroundColor: 'pink'
            });
            newCanv.add(oImg, );
            setCanvas(newCanv);
        });
    }

  }, [imageUrl])

  return(
    <div style= {{
            border : "5px black solid"
        }}>
      <canvas id="canvas" />
    </div>
  );
};



export default Canvas;