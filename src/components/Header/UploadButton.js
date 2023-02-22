import React, { useRef, useState, useEffect } from "react";

import { Flex, Spacer } from '@chakra-ui/react'
import {ReactComponent as Upload}  from "../../assets/upload.svg";

const UploadButton = ({imageUrl, setImageUrl}) => {
  const inputFileRef = useRef(null);

  const uploadImage = (event) => {
    const target = event.target;
    const file = (target.files)[0];

    if (!file) {
      console.log("No file found");
      return;
    }

    console.log("Image loaded");
    const reader = new FileReader();

    reader.onloadend = async () => {
    setImageUrl(String(reader.result));
 
    };
    reader.readAsDataURL(file);
  };

  const clickHandler = () => {
    if (inputFileRef && inputFileRef.current) {
      inputFileRef.current.click();
    }
  };

  return (
    <>
        <Flex>
            <Upload onClick={clickHandler} width="20px" height="20px"/>
            <input
                ref={inputFileRef}
                type="file"
                onChange={uploadImage}
                accept="image/jpeg"
            />
        </Flex>
    </>
  );
};

export default UploadButton;