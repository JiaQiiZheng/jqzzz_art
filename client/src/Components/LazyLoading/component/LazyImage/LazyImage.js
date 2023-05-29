import React, { useState, useEffect, useRef } from "react";
import "./LazyImage.css";

const LazyImage = ({ src, alt }) => {
  const imageRef = useRef("null");
  const [isIntersecting, setIsIntersecting] = React.useState(false);

  useEffect(() => {
    imageRef.current.classList.toggle("show");
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          imageRef.current.classList.toggle("show", isIntersecting);
          setIsIntersecting(entry.isIntersecting);
        }
        imageRef.current.classList.toggle("show");
      },
      { rootMargin: "100% 0% 100% 0%", threshold: 0.5 }
    );
    observer.observe(imageRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (isIntersecting) {
      const dataSrc = imageRef.current.getAttribute("data-src");
      if (dataSrc) {
        imageRef.current.src = dataSrc;
      }
    }
  }, [isIntersecting]);
  return (
    <img
      className="lazy-image"
      src={src}
      alt={alt}
      ref={imageRef}
      data-src={src}
    />
  );
};

export default LazyImage;
