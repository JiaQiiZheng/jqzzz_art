import React, { useEffect } from "react";
import Zmage from "react-zmage";
import { Link } from "react-router-dom";

const baseUrl = process.env.REACT_APP_API_URL;

export default function HomePage() {
  // focus on iframe when loaded
  useEffect(() => {
    const iframe = document.getElementsByClassName("turnjs_iframe_inserted")[0];
    if (iframe) {
      iframe.focus();
    }
    return;
  }, []);

  return (
    <div className="home_page">
      <iframe
        className="turnjs_iframe_inserted"
        src={window.location.origin + "/645609d7bb856cb2c9fbb505"}
        frameBorder="0"
      ></iframe>
      <Zmage
        className="profile"
        src="https://jqzzz.s3.amazonaws.com/1679927376239.jpg"
        alt="HomePage"
      />
      <Link
        className="link arrow"
        to="exhibition/post/6420cc5b020a31ca53a37fb0"
      ></Link>
      <a href="exhibition/post/6420cc5b020a31ca53a37fb0" className="Brief">
        Howland Exhibition
      </a>
      {/* <AdobePdfViewer
        url={"https://jqzzz.s3.amazonaws.com/1681940740260.pdf"}
      /> */}
      {/* <BaltimoreStudio_20230429 /> */}
    </div>
  );
}
