import React from "react";
import Zmage from "react-zmage";

// improvement of react zmage
function handleDoubleClickZoom() {
  document.getElementById("zmageControlZoom").click();
}
function handleEsc() {
  document.getElementById("zmageControlClose").click();
}
const handleBrowsing = (state) => {
  if (state) {
    document.getElementsByTagName("figure")[0].onclick = handleDoubleClickZoom;
  }
};
const handleZooming = (state) => {
  if (state) {
    document.getElementsByTagName("figure")[0].onclick = handleEsc;
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
        onZooming={(state) => {
          handleZooming(state);
        }}
        {...rest}
        src={src}
        alt={""}
      />
    </div>
  );
}
