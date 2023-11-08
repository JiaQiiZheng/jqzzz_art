import React, { useEffect, useState } from "react";
import Turnjs5 from "./Turnjs5";
import { useParams } from "react-router-dom";

const page_width = 1200;
const page_height = 1200;
const randomPages = (pageNumber) => {
  var page_src = [];
  while (pageNumber--) {
    page_src.push(
      `https://picsum.photos/seed/${pageNumber}/${page_width}/${page_height}?grayscale`
    );
  }
  return page_src;
};

const Turnjs5_Iframe = () => {
  document.body.style.overflow = "hidden";

  const id = useParams().bookId;
  const [urls, setUrls] = useState();

  // get dimension of the page
  const [width, setWidth] = useState();
  const [height, setHeight] = useState();
  const getMeta = (url, callback) => {
    const img = new Image();
    img.onload = () => callback(null, img);
    img.onerror = (err) => {
      callback(err);
    };
    img.src = url;
  };

  // get pages from database
  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/booklet/${id}`)
      .then((response) => {
        return response.json();
      })
      .then((postInfo) => {
        if (postInfo.uploadedFiles[0] != undefined || postInfo.uploadedFiles[0]!="") {
          return JSON.parse(postInfo.uploadedFiles[0]);
        } else {
          return [];
        }
      })
      .then((pages) =>
        pages.map((page) => `https://jqzzz.s3.amazonaws.com/${page.serverId}`)
      )
      .then((urls) => {
        // set random page as placeholder if no urls data supplied
        if (urls.length) {
          setUrls(urls);
          getMeta(urls[0], (err, img) => {
            setWidth(img.naturalWidth);
            setHeight(img.naturalHeight);
          });
        } else {
          urls = randomPages(10);
          setUrls(urls);
          getMeta(urls[0], (err, img) => {
            setWidth(img.naturalWidth);
            setHeight(img.naturalHeight);
          });
        }
      });
  }, []);

  return (
    <div className="turnjs5_iframe">
      {urls && width && height && <Turnjs5 params={[urls, width, height]} />}
    </div>
  );
};

export default Turnjs5_Iframe;
