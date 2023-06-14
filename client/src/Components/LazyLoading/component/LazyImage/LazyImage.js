import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "./LazyImage.css";

const LazyImage = ({ src, alt, props }) => {
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
      { rootMargin: "100% 0% 100% 0%", threshold: 0.3 }
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
    <Link to={props}>
      <img
        className="lazy-image"
        src={src}
        width={100}
        height={100}
        alt={alt}
        ref={imageRef}
        data-src={src}
      />
    </Link>
  );
};

export default LazyImage;
