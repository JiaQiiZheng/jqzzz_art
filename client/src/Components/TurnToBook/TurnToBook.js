import React from "react";
import $ from "jquery";
import "turn.js";
import Turn from "./Turn";
import "./style.css";

const page_width = 600;
const page_height = 600;

const options = {
  width: page_width * 2,
  height: page_height,
  autoCenter: true,
  display: "double",
  acceleration: true,
  elevation: 50,
  when: {
    turned: function (e, page) {
      console.log("Current view: ", $(this).turn("view"));
    },
  },
};

function randomPages(page_number) {
  var pages = [];
  while (page_number--) {
    pages.push(
      `https://picsum.photos/${page_width}/${page_height}?grayscale&random=${page_number}`
    );
  }
  return pages;
}

const TurnToBook = () => {
  return (
    <Turn options={options} className="flipbook">
      {randomPages(20).map((page, index) => (
        <div key={index} className="page">
          <img src={page} alt="" />
        </div>
      ))}
    </Turn>
  );
};

export default TurnToBook;
