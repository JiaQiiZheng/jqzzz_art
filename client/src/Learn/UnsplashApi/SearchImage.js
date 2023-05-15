import React, { useEffect, useState, useRef } from "react";
import { createApi } from "unsplash-js";
import "./App.css";
import { debounce } from "lodash";
import { BounceLoader } from "react-spinners";

const unsplash = createApi({
  accessKey: "fA4TUYP3Ge5pWwloDUU9XCK3j9wfFkfARpdwF9bU2Xc",
});

export default function SearchImage() {
  const [phrase, setPhrase] = useState("");
  const phraseRef = useRef(phrase);
  const [images, setImages] = useState([]);
  const imagesRef = useRef(images);
  const [fetching, setFetching] = useState(false);
  const fetchingRef = useRef(fetching);

  function getUnsplashImages(query, page, perpage) {
    setFetching(true);
    fetchingRef.current = true;
    return new Promise((resolve, reject) => {
      unsplash.search
        .getPhotos({
          query,
          page,
          perpage: 10,
        })
        .then((result) => {
          setFetching(false);
          fetchingRef.current = false;
          resolve(result.response.results.map((result) => result.urls.regular));
        });
    });
  }
  useEffect(() => {
    phraseRef.current = phrase;
    if (phrase !== "") {
      debounce(() => {
        getUnsplashImages(phrase, 1).then((images) => {
          setImages(images);
          imagesRef.current = images;
        });
      }, 2000)();
      // getUnsplashImages(phrase, 1).then((images) => {
      //   setImages(images);
      // });
    }
  }, [phrase]);

  function handleScroll(e) {
    const { scrollHeight, scrollTop, clientHeight } = e.target.scrollingElement;
    const isBottom = scrollHeight - scrollTop <= clientHeight;
    if (isBottom && !fetchingRef.current) {
      getUnsplashImages(
        phraseRef.current,
        imagesRef.current.length / 5 + 1
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
      <br />
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
