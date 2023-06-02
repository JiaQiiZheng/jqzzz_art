import React from "react";
import Zmage from "react-zmage";
import { Link } from "react-router-dom";

//adobePdfViewer
import AdobePdfViewer from "../PdfViewer/App";

//insert issuu document
import BaltimoreStudio_20230429 from "../IssuuDocument/BaltimoreStudio_20230429";
import Portfolio_2014_2020 from "../IssuuDocument/Portfolio_2014_2020";
import NewOrleansSketchBook from "../IssuuDocument/NewOrleansSketchBook";

// turn.js convertor
import Turnjs5 from "../Components/TurnToBook/Turnjs5";

const baseUrl = process.env.REACT_APP_API_URL;

export default function HomePage() {
  return (
    <div className="home_page">
      <Turnjs5 />
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
      <NewOrleansSketchBook />
    </div>
  );
}
