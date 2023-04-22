import React, { useRef, useState, useEffect } from "react";
// import { fabric } from 'fabric';

import "../styles/Canvas.css";

const Canvas = ({canvasRef}) => {
    return(
      <div className="_canvas">
        <canvas ref={canvasRef} id="canvas" />
        
      </div>
    );
};



export default Canvas;