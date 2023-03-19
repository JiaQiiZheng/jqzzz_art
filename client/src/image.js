import React from "react";
import Zmage from "react-zmage";

export default function Image({ src, ...rest }) {
  src =
    src && src.includes("https://")
      ? src
      : "http//localhost:4000/uploads/" + src;
  return (
    <div className="image">
      <Zmage {...rest} src={src} alt={""} />
    </div>
  );
}
