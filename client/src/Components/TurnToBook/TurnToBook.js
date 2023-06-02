import React from "react";
import $ from "jquery";
import "./turn.js";
import "./style.css";

class Turn extends React.Component {
  static defaultProps = {
    style: {},
    className: "",
    options: {},
  };

  componentDidMount() {
    if (this.el) {
      $(this.el).turn(Object.assign({}, this.props.options));
    }
    document.addEventListener("keydown", this.handleKeyDown, false);
  }

  componentWillUnmount() {
    if (this.el) {
      $(this.el).turn("destroy").remove();
    }
    document.removeEventListener("keydown", this.handleKeyDown, false);
  }

  handleKeyDown = (event) => {
    if (event.keyCode === 37) {
      $(this.el).turn("previous");
    }
    if (event.keyCode === 39) {
      $(this.el).turn("next");
    }
  };

  render() {
    return (
      <div
        className={this.props.className}
        style={Object.assign({}, this.props.style)}
        ref={(el) => (this.el = el)}
      >
        {this.props.children}
      </div>
    );
  }
}

const page_width = 400;
const page_height = 400;
const options = {
  width: page_width * 2,
  height: page_height,
  autoCenter: true,
  display: "double",
  acceleration: true,
  elevation: 50,
  gradients: !$.isTouch,
  when: {
    // turned: function (e, page) {
    //   console.log("Current view: ", $(this).turn("view"));
    // },
    // missing: function (e, pages) {
    //   for (var i = 0; i < pages.length; i++) {
    //     $(".magazine").turn("addPage", page[pages[i]], pages[i]);
    //   }
    // },
  },
};

const randomPages = (pageNumber) => {
  var page_src = [];
  while (pageNumber--) {
    page_src.push(
      `https://picsum.photos/${page_width}/${page_height}?grayscale&random=${pageNumber}`
    );
  }
  return page_src;
};

const TurnToBook = () => {
  return (
    <div className="magzine-viewport">
      <div className="container">
        <Turn options={options} className="magazine">
          {randomPages(20).map((page, index) => (
            <div key={index} className="page">
              <img src={page} alt="" />
            </div>
          ))}
        </Turn>
      </div>
    </div>
  );
};

export default TurnToBook;
