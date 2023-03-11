import {ReactComponent as Save} from "../../assets/save.svg";

const SaveButton = ({canvas}) => {
  
  const saveImage = () => {
    //check if canvas is empty
    // if (!imageStore.url || UIStore.isToolbarOpen) {
    //   return;
    // }

    const randomNum = Math.floor(Math.random() * 1000);
    const fileName = `image-${randomNum}.png`;

    const link = document.createElement("a");
    link.download = fileName;
    link.href = canvas.toDataURL("image/png");;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    link.remove();
  };

  return (
    <>
      <Save className="header_button"
        onClick={saveImage}
      />
    </>
  );
};

export default SaveButton;