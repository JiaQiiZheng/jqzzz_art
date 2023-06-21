import React, { useEffect, useState } from "react";
import { Link, Route, Routes } from "react-router-dom";

export default function Menu() {
  // restyle function for onclick section
  const reStyle = (currentTag) => {
    setTimeout(() => {
      var allTags = document.getElementsByClassName("menu_text");
      for (var i = 0; i < allTags.length; i++) {
        allTags[i].innerHTML === currentTag.innerHTML
          ? allTags[i].classList.add("menu_active")
          : allTags[i].classList.remove("menu_active");
      }
    }, 1);
  };

  return (
    <nav className="menu">
      <i className="menu_icon"></i>
      <ul>
        <li>
          <Link
            onClick={(e) => {
              reStyle(e.target);
            }}
            name="section_name"
            to="/design"
            className="menu_text"
          >
            design & research
          </Link>
        </li>
        <li>
          <Link
            onClick={(e) => {
              reStyle(e.target);
            }}
            name="section_name"
            to="/programming"
            className="menu_text"
          >
            programming
          </Link>
        </li>
        <li>
          <Link
            onClick={(e) => {
              reStyle(e.target);
            }}
            name="section_name"
            to="/exhibition"
            className="menu_text"
          >
            exhibition
          </Link>
        </li>
        <li>
          <Link
            onClick={(e) => {
              reStyle(e.target);
            }}
            name="section_name"
            to="/computation"
            className="menu_text"
          >
            computation community
          </Link>
        </li>
        <li>
          <Link
            onClick={(e) => {
              reStyle(e.target);
            }}
            name="section_name"
            to="/art"
            className="menu_text"
          >
            art
          </Link>
        </li>
        {/* <li>
        <Link to="/ai/prompt" className="menu_text">
          prompt library
        </Link>
      </li> */}
      </ul>
    </nav>
  );
}
