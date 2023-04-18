import React from "react";
import Zmage from "react-zmage";
import { Link } from "react-router-dom";

const baseUrl = process.env.REACT_APP_API_URL;

export default function HomePage() {
  return (
    <div className="home_page">
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
    </div>
  );
}
