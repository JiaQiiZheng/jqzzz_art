import React, { useEffect } from "react";
import "./style.css";
import LazyImage from "../../Components/LazyLoading/component/LazyImage/LazyImage";
import { data } from "../../Components/LazyLoading/constant/data";

// const cards = document.querySelectorAll(".card");

// const observer = new IntersectionObserver(
//   (entries) => {
//     entries.forEach((entry) => {
//       entry.target.classList.toggle("show", entry.isIntersecting);
//     });
//   },
//   { threshold: 1 }
// );
// cards.forEach((card) => {
//   observer.observe(card);
// });

const Card = () => {
  return (
    <div className="images-container">
      <div className="lazy-images">
        {data.map((item, index) => (
          <LazyImage src={item.src} alt={index} />
        ))}
      </div>
    </div>
  );
};

export default Card;
