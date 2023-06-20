import React, { useEffect, useState } from 'react';

function Base64ImageInput({ selectedImageUrl, finalImageUrl, setFinalImageUrl }) {
//   const [imageUrl, setImageUrl] = useState(selectedImageUrl);
  const [confirm, setConfirm] = useState(false);


  const handleConfirm = (e) => {
    //disable crop field or lock selectedImageUrl
    // setShowConfirm(false);
    e.preventDefault()
    setConfirm(true);
    // do something with the base64 encoded image data
  };

  const handleReselect = (e) => {
    // setShowConfirm(false);
    e.preventDefault()
    setConfirm(false);
    // setImageUrl(defaultImageUrl);
  };

  useEffect(() => {
    if (!confirm){
        setFinalImageUrl(selectedImageUrl);
    }
  }, [selectedImageUrl]);

  return (
    <div className="base64-image-input">
      <img src={finalImageUrl} alt="Selected image" className="selected-image" width="256" height="256" />

        <div className="confirm-controls">
          <button onClick={handleConfirm}>Confirm</button>
          <button onClick={handleReselect}>Reselect</button>
        </div>
    </div>
  );
}



export default Base64ImageInput;