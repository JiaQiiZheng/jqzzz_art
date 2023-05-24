import React from "react";
import { Link, Route, Routes } from "react-router-dom";

export default function Menu() {
  return (
    <nav className="menu">
      <i className="menu_icon"></i>
      <li>
        <Link to="/design" className="menu_text">
          design & research
        </Link>
      </li>
      <li>
        <Link to="/programming" className="menu_text">
          programming
        </Link>
      </li>
      <li>
        <Link to="/exhibition" className="menu_text">
          exhibition
        </Link>
      </li>
      <li>
        <Link to="/computation" className="menu_text">
          computation community
        </Link>
      </li>
      <li>
        <Link to="/art" className="menu_text">
          art
        </Link>
      </li>
      {/* <li>
        <Link to="/ai/prompt" className="menu_text">
          prompt library
        </Link>
      </li> */}
    </nav>
  );
}
