import React, { useEffect, useState } from "react";
import LazyImage from "./LazyImage";

const LoadProjectData = ({ props }) => {
  // horizontally scroll
  const scrollableElement = document.querySelectorAll("#lazy-images");
  scrollableElement.forEach(
    (item) =>
      item &&
      item.addEventListener("wheel", (ev) => {
        ev.preventDefault();
        item.scrollLeft += ev.deltaY + ev.deltaX;
      })
  );

  // get section name
  const currentUrlArray = window.location.href.split("/");
  const sectionName = currentUrlArray[currentUrlArray.length - 1];

  const [imageUrls, setImageUrls] = useState([]);

  function generateObj(url) {
    const urlObj = { src: url };
    return urlObj;
  }

  var urls = [];

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/post/${sectionName}`).then(
      (response) => {
        response
          .json()
          .then((posts) => posts.filter((item) => item.projectName === props))
          .then((posts) =>
            posts.forEach((post) => {
              urls.push(generateObj(post.cover));
              setImageUrls([...urls]);
            })
          );
      }
    );
  }, []);

  return (
    <div className="lazy-images" id="lazy-images">
      {imageUrls.map((item, index) => (
        <LazyImage src={item.src} key={index} alt={index} />
      ))}
    </div>
  );
};

export default LoadProjectData;
