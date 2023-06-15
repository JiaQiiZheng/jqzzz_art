import React from "react";
import Zmage from "./Components/react-zmage";

// improvement of react zmage
function handleDoubleClickZoom() {
  document.getElementById("zmageControlZoom").click();
}
const handleBrowsing = (state) => {
  if (state) {
    document.getElementById("zmage").ondblclick = handleDoubleClickZoom;
  }
};

export default function Image({ src, ...rest }) {
  src =
    src && src.includes("https://")
      ? src
      : "http//localhost:4000/uploads/" + src;
  return (
    <div className="image">
      <Zmage
        onBrowsing={(state) => {
          handleBrowsing(state);
        }}
        {...rest}
        src={src}
        alt={""}
      />
    </div>
  );
}
