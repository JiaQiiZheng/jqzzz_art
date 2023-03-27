import React from "react";
import { Link, Route, Routes } from "react-router-dom";

export default function Menu() {
  return (
    <nav className="menu">
      <i className="menu_icon"></i>
      <li>
        <Link to="/design" className="menu_text">
          design
        </Link>
      </li>
      <li>
        <Link to="/exhibition" className="menu_text">
          exhibition
        </Link>
      </li>
      <li>
        <Link to="/computation" className="menu_text">
          computation
        </Link>
      </li>
      <li>
        <Link to="/art" className="menu_text">
          art
        </Link>
      </li>
    </nav>
  );
}
