import React from "react";
import Zmage from "react-zmage";
import * as ReactImprovement from "./Components/react-zmage/zmageImprovement";

export default function Image({ src, ...rest }) {
  src =
    src && src.includes("https://")
      ? src
      : "http//localhost:4000/uploads/" + src;
  return (
    <div className="image">
      <Zmage
        onBrowsing={(state) => {
          ReactImprovement.handleBrowsing(state);
        }}
        onZooming={(state) => {
          ReactImprovement.handleZooming(state);
        }}
        {...rest}
        src={src}
        alt={""}
      />
    </div>
  );
}
