import React, { useState } from 'react';

const SliderToggleButton = ({isOn, setIsOn}) => {

  const handleClick = () => {
    setIsOn(!isOn);
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '50px',
        height: '25px',
        backgroundColor: isOn ? 'green' : 'gray',
        borderRadius: '20px',
        padding: '4px',
        cursor: 'pointer',
      }}
      onClick={handleClick}
    >
      <div
        style={{
          height: '20px',
          width: '20px',
          backgroundColor: '#fff',
          borderRadius: '50%',
          transform: isOn ? 'translateX(32px)' : 'translateX(0)',
          transition: 'transform 0.2s ease-in-out',
        }}
      />
    </div>
  );
};

export default SliderToggleButton;