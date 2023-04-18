import React, { useEffect, useState } from "react";

export default function App() {
  const [sourceType, setSourceType] = useState("posts");
  useEffect(() => {
    console.log("SourceType Changed");
    return () => {
      console.log("Clean Up");
    };
  }, [sourceType]);
  //   const [items, setItems] = useState([]);
  //   const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  //   const handleResize = () => {
  //     setWindowWidth(window.innerWidth);
  //   };
  //   useEffect(() => {
  //     window.addEventListener("resize", handleResize);
  //     return () => {
  //       window.removeEventListener("resize", handleResize);
  //     };
  //   }, []);
  //   useEffect(() => {
  //     window.addEventListener("resize", handleResize);
  //     console.log("clean up");

  //     return () => {
  //       window.removeEventListener("resize", handleResize);
  //     };
  //   }, []);
  //   useEffect(() => {
  //     fetch(`https://jsonplaceholder.typicode.com/${sourceType}`)
  //       .then((response) => response.json())
  //       .then((json) => setItems(json));
  //   }, [sourceType]);

  return (
    // <div>
    //   <button onClick={() => setSourceType("posts")}>Posts</button>
    //   <button onClick={() => setSourceType("users")}>Users</button>
    //   <button onClick={() => setSourceType("comments")}>Comments</button>
    //   <h1>{sourceType}</h1>
    //   {items.map((item) => {
    //     return <pre>{JSON.stringify(item)}</pre>;
    //   })}
    // </div>
    <div>
      <button onClick={() => setSourceType("posts")}>Posts</button>
      <button onClick={() => setSourceType("users")}>Users</button>
      <button onClick={() => setSourceType("comments")}>Comments</button>
      <h1>{sourceType}</h1>
    </div>
  );
}
