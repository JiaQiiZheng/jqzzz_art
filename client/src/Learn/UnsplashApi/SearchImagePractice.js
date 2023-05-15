import React, { useEffect, useRef, useState } from "react";
import { createApi } from "unsplash-js";
import "./App.css";
import { debounce, divide } from "lodash";
import { BounceLoader } from "react-spinners";

const unsplash = createApi({
  accessKey: "fA4TUYP3Ge5pWwloDUU9XCK3j9wfFkfARpdwF9bU2Xc",
});

export default function SearchImagePractice() {
  const [phrase, setPhrase] = useState("");
  const phraseRef = useRef(phrase);
  const [images, setImages] = useState([]);
  const imagesRef = useRef(images);
  const [fetching, setFetching] = useState(false);
  const fetchingRef = useRef(fetching);
  const [perPage, setPerPage] = useState(5);
  const perPageRef = useRef(perPage);

  function getUnsplashImages(query, page, perPage) {
    setFetching(true);
    fetchingRef.current = true;
    return new Promise((resolve, reject) => {
      unsplash.search
        .getPhotos({
          query,
          page,
          perPage,
        })
        .then((result) => {
          setFetching(false);
          fetchingRef.current = false;
          resolve(result.response.results.map((result) => result.urls.regular));
        });
    });
  }

  useEffect(() => {
    perPageRef.current = 3;
    phraseRef.current = phrase;
    if (phrase !== "") {
      debounce(() => {
        getUnsplashImages(phrase, 1, perPageRef.current).then((images) => {
          setImages(images);
          imagesRef.current = images;
        });
      }, 2000)();
    }
  }, [phrase]);

  function handleScroll(e) {
    const [scrollHeight, scrollTop, clientHeight] = e.target.scrollingElement;
    const isBottom = scrollHeight - scrollTop <= clientHeight;
    if (isBottom && !fetchingRef.current) {
      getUnsplashImages(
        phraseRef.current,
        imagesRef.current.length / perPageRef.current + 1
      ).then((newImages) => {
        imagesRef.current = [...imagesRef.current, ...newImages];
        setImages(imagesRef.current);
      });
    }
  }

  useEffect(() => {
    document.addEventListener("scroll", handleScroll, { passive: true });
    return () => document.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div>
      <input
        type="text"
        value={phrase}
        onChange={(e) => setPhrase(e.target.value)}
      />
      {images.length > 0 && images.map((url) => <img src={url} />)}
      <div>
        {fetching && (
          <div style={{ textAlign: "center" }}>
            <BounceLoader speedMultiplier={5} color={"#000000"} />
          </div>
        )}
      </div>
    </div>
  );
}
