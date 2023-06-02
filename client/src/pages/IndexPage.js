import { useLocation } from "react-router-dom";
import Post from "../Post";
import { useEffect, useRef, useState } from "react";
import Turnjs5 from "../Components/TurnToBook/Turnjs5";

export default function IndexPage() {
  //get section name
  const currentUrlArray = window.location.href.split("/");

  const sectionName = currentUrlArray[currentUrlArray.length - 1];
  const [posts, setPosts] = useState([]);
  const [pageNum, setPageNum] = useState(1);
  const scrollHeightTempRef = useRef();

  function nextPage() {
    setPageNum((prev) => prev + 1);
  }
  // function resetPage() {
  //   setPageNum(1);
  //   console.log("reset____" + pageNum);
  // }

  //windowScrollListener
  const handleScroll = (e) => {
    // if (
    //   window.innerHeight + e.target.documentElement.scrollTop + 1 >=
    //   e.target.documentElement.scrollHeight
    // ) {
    //   nextPage();
    // }
    const { scrollHeight, scrollTop, clientHeight } = e.target.scrollingElement;
    let isBottom = false;
    isBottom = scrollHeight - scrollTop - 1 <= clientHeight;

    if (isBottom && scrollHeightTempRef.current == scrollHeight) {
      nextPage();
    }
    scrollHeightTempRef.current = scrollHeight;
  };

  useEffect(() => {
    fetch(
      `${process.env.REACT_APP_API_URL}/post/${sectionName}?page=${pageNum}`
    ).then((response) => {
      const currentPosts = posts;
      response.json().then((posts) => {
        setPosts([...currentPosts, ...posts]);
      });
    });
  }, [pageNum]);

  function loadFirst() {
    setPageNum(1);
    setPosts([]);
    fetch(
      `${process.env.REACT_APP_API_URL}/post/${sectionName}?page=${pageNum}`
    ).then((response) => {
      response.json().then((posts) => {
        setPosts([...posts]);
      });
    });
  }

  useEffect(() => {
    document.addEventListener("scroll", handleScroll);
    return () => document.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    // setPageNum(1);
    setPosts([]);
    loadFirst();
  }, [sectionName]);

  return (
    <div className="posts">
      <Turnjs5 />
      {posts.length > 0 && posts.map((post, i) => <Post key={i} {...post} />)}
    </div>
  );
}
