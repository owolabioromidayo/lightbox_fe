import React from "react";
import UploadButton from "./UploadButton";
import SaveButton from "./SaveButton";
// import RedoButton from "./RedoButton";
// import UndoButton from "./UndoButton";
// import ZoomControl from "./ZoomControl";
import { Flex, Spacer } from '@chakra-ui/react'

const Header = ({imageUrl, setImageUrl, canvas}) => {

  return (
    <>
        <Flex direction="row">
            <UploadButton imageUrl={imageUrl} setImageUrl={setImageUrl} />
            <SaveButton canvas={canvas} />
        </Flex>
    </>
  );
};

export default Header;