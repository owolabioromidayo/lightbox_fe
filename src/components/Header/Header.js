import React from "react";
import UploadButton from "./UploadButton";
import SaveButton from "./SaveButton";
// import RedoButton from "./RedoButton";
// import UndoButton from "./UndoButton";
// import ZoomControl from "./ZoomControl";
import { Flex, Spacer } from '@chakra-ui/react'

import {ReactComponent as Redo} from "../../assets/redo.svg";
import {ReactComponent as Undo} from "../../assets/undo.svg";

import "../../styles/Header.css";

const Header = ({imageUrl, setImageUrl, canvas, handleRedo, handleUndo}) => {

  return (
    <>
        <Flex direction="row" className="header">

          <div className="header_redo_buttons">
            <Undo className="header_button-disabled"
              // onClick={handleUndo}
            />
            <Redo className="header_button-disabled"
              // onClick={handleRedo}
            />
          </div>

          <div className="header_file_buttons">
            <UploadButton imageUrl={imageUrl} setImageUrl={setImageUrl} />
            <SaveButton canvas={canvas} />
          </div>
        </Flex>
    </>
  );
};

export default Header;