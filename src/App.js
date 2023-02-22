import Canvas from "./components/Canvas";
import { Flex, Spacer } from '@chakra-ui/react'
import './App.css';
import { useState } from "react";
import Header from "./components/Header/Header";

function App() {

  const [imageUrl, setImageUrl]  = useState(null);
  const [canvas, setCanvas]  = useState(null);

  return (
    <>
    <Flex direction="column">
      <Header imageUrl={imageUrl} setImageUrl={setImageUrl} canvas={canvas} />
      <Canvas imageUrl={imageUrl} canvas={canvas} setCanvas={setCanvas} />
    </Flex>
    </>

  );
}

export default App;
