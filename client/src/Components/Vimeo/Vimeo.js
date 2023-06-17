import React, { useEffect, useRef, useState } from "react";

const Vimeo = ({ params }) => {
  const wrapperRef = useRef();
  const [url, setUrl] = useState();

  new Promise((resolve, reject) => {
    fetch(params)
      .then((res) => {
        return res.json();
      })
      .then((result) => {
        resolve(setUrl(result.embedCode));
      })
      .catch((err) => {
        setUrl("");
        reject(console.error(err));
      });
  });

  useEffect(() => {
    if (url) {
      wrapperRef.current.innerHTML = url;
    }
  });

  return <div className="booklet_iframe" ref={wrapperRef}></div>;
};

export default Vimeo;
