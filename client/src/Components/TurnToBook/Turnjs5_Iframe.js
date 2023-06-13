import React, { useEffect, useState } from "react";
import Turnjs5 from "./Turnjs5";
import { useParams } from "react-router-dom";

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
        return JSON.parse(postInfo.uploadedFiles[0]);
      })
      .then((pages) =>
        pages.map((page) => `https://jqzzz.s3.amazonaws.com/${page.serverId}`)
      )
      .then((urls) => {
        setUrls(urls);
        getMeta(urls[0], (err, img) => {
          setWidth(img.naturalWidth);
          setHeight(img.naturalHeight);
        });
      });
  }, []);

  return (
    <div className="turnjs5_iframe">
      {urls && <Turnjs5 params={[urls, width, height]} />}
    </div>
  );
};

export default Turnjs5_Iframe;
