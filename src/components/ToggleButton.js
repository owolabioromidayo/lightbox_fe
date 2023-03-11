import React from "react";

const ToggleButton = props => {
  const {title, callback, checked} = props;
  return (
    <>
      <div className="toolbar__block toggle-btn__wrapper">
        <p className="toggle-btn__title">{title}</p>
        <input
          type="checkbox"
          checked={checked}
          onChange={callback}
          className="toggle-btn checkbox"
        />
      </div>
    </>
  );
};

export default ToggleButton;