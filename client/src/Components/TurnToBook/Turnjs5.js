import React, { useEffect } from "react";
import $ from "jquery";
import { Helmet } from "react-helmet";
import "./css/style.css";

const pageNumber = 20;
const page_width = 800;
const page_height = 800;
const randomPages = (pageNumber) => {
  var page_src = [];
  while (pageNumber--) {
    page_src.push(
      `https://picsum.photos/seed/${pageNumber}/${page_width}/${page_height}?grayscale`
    );
  }
  return page_src;
};

export default function Turnjs5() {
  useEffect(() => {
    const scriptTag_1 = document.createElement("script");
    scriptTag_1.src = "./assets/js/script.js";
    scriptTag_1.type = "text/javascript";
    scriptTag_1.async = true;
    document.body.appendChild(scriptTag_1);

    const scriptTag_2 = document.createElement("script");
    scriptTag_2.src = "https://code.jquery.com/jquery-2.0.3.min.js";
    scriptTag_2.type = "text/javascript";
    scriptTag_2.async = true;
    document.body.appendChild(scriptTag_2);

    const scriptTag_3 = document.createElement("script");
    scriptTag_3.src =
      "https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.9.1/underscore-min.js";
    scriptTag_3.type = "text/javascript";
    scriptTag_3.async = true;
    document.body.appendChild(scriptTag_3);

    const scriptTag_4 = document.createElement("script");
    scriptTag_4.src =
      "https://cdnjs.cloudflare.com/ajax/libs/backbone.js/1.4.0/backbone-min.js";
    scriptTag_4.type = "text/javascript";
    scriptTag_4.async = true;
    document.body.appendChild(scriptTag_4);

    return () => {
      document.body.removeChild(scriptTag_1);
      document.body.removeChild(scriptTag_2);
      document.body.removeChild(scriptTag_3);
      document.body.removeChild(scriptTag_4);
    };
  }, []);
  return (
    <div className="turnjs_container">
      <Helmet name="turnjs_helmet">
        {/* // <!-- Turn.js UI Kit --> */}
        {/* <script type="text/javascript" src="./assets/js/turn.min.js"></script> */}
        {/* // <!-- App dependencies --> */}
        {/* <script type="text/javascript" src="./assets/js/app.js"></script> */}
        {/* <script type="text/javascript" src="./assets/js/script.js"></script>; */}
        {/* <script src="https://code.jquery.com/jquery-2.0.3.min.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.9.1/underscore-min.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/backbone.js/1.4.0/backbone-min.js"></script> */}
        {/* <!-- turnjs css dependencies --> */}
      </Helmet>

      {/* <!-- partial:index.partial.html --> */}
      <div className="catalog-app">
        <div id="viewer">
          <div id="flipbook" className="ui-flipbook">
            {/* <!-- Do not place the content here --> */}
            <a ignore="1" className="ui-arrow-control ui-arrow-next-page"></a>
            {randomPages(pageNumber).map((page, index) => (
              <img key={index} className="randomPage" src={page} alt="" />
            ))}
            <a
              ignore="1"
              className="ui-arrow-control ui-arrow-previous-page"
            ></a>
          </div>
        </div>

        {/* <!-- controls --> */}
        <div id="controls">
          <div className="all">
            <div className="ui-slider" id="page-slider">
              <div className="bar">
                <div className="progress-width">
                  <div className="progress">
                    <div className="handler"></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="ui-options" id="options">
              <a className="ui-icon" id="ui-icon-table-contents">
                <i className="fa fa-bars"></i>
              </a>
              <a
                className="ui-icon show-hint"
                title="Miniatures"
                id="ui-icon-miniature"
              >
                <i className="fa fa-th"></i>
              </a>
              <a className="ui-icon" id="ui-icon-zoom">
                <i className="fa fa-file-o"></i>
              </a>
              <a className="ui-icon show-hint" title="Share" id="ui-icon-share">
                <i className="fa fa-share"></i>
              </a>
              <a
                className="ui-icon show-hint"
                title="Full Screen"
                id="ui-icon-full-screen"
              >
                <i className="fa fa-expand"></i>
              </a>
              <a className="ui-icon show-hint" id="ui-icon-toggle">
                <i className="fa fa-ellipsis-v"></i>
              </a>
            </div>
            {/* <!-- zoom slider --> */}
            <div id="zoom-slider-view" className="zoom-slider">
              <div className="bg">
                <div className="ui-slider" id="zoom-slider">
                  <div className="bar">
                    <div className="progress-width">
                      <div className="progress">
                        <div className="handler"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* <!-- / zoom slider --> */}
          </div>

          <div id="ui-icon-expand-options">
            <a className="ui-icon show-hint">
              <i className="fa fa-ellipsis-h"></i>
            </a>
          </div>
        </div>
        {/* <!-- / controls --> */}

        {/* <!-- miniatures --> */}
        <div id="miniatures" className="ui-miniatures-slider"></div>
        {/* <!-- / miniatures --> */}
      </div>
    </div>
  );
}
