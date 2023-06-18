import React, { useEffect, useState, useRef } from 'react';
import { fabric } from "fabric";

function ImageMaskInput({mask, setMask}) {
    const [canvas, setCanvas] = useState(null)
    const canvasRef = useRef(null)

    let width = 300;
    let height = 300;


    useEffect(() => {

        let canv = new fabric.Canvas("image_mask_canv", {
                height: height,
                width: width,
                backgroundColor: 'white',
                isDrawingMode: true,
            }) 
        
        canv.freeDrawingBrush.color = "#000"
        canv.freeDrawingBrush.width = 80

        canv.renderAll();
        setCanvas(canv)
    }, [])


    const handleReset = () => {

        let canv = new fabric.Canvas("image_mask_canv", {
                height:  height,
                width: height,
                backgroundColor: 'white',
                isDrawingMode: true,
            }) 
        
        canv.freeDrawingBrush.color = "#000"
        canv.freeDrawingBrush.width = 80

        setCanvas(canv)
        canv.renderAll();

    }

    const handleConfirm = (e) => {
        e.preventDefault()
        //scale image
        let newCanv = canvasRef.current;

        let newMask = newCanv.toDataURL({
            // left : 0,
            // top : 0,
            // width : 512,
            // height: 512,
            // multiplier: 1.5, 

        })

        console.log(newMask);
        setMask(newMask)

    }

    return (
    <div>
        <canvas id="image_mask_canv" ref={canvasRef} />
        <button onClick={handleConfirm}>Confirm</button>
        {/* <button onClick={handleReset}>Reset</button> */}
    </div>
    );
}



export default ImageMaskInput;