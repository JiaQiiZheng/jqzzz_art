import React from "react";
import Turnjs5 from "./Turnjs5";

const Turnjs5_Iframe = () => {
  document.body.style.overflow = "hidden";
  return (
    <div className="turnjs5_iframe">
      <Turnjs5 />
    </div>
  );
};

export default Turnjs5_Iframe;
