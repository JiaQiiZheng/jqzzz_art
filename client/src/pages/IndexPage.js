import Post from "../Post";
import { useEffect, useRef, useState } from "react";

export default function IndexPage() {
  //get section name
  const currentUrlArray = window.location.href.split("/");
  const sectionName = currentUrlArray[currentUrlArray.length - 1];
  const [posts, setPosts] = useState([]);
  const [pageNum, setPageNum] = useState(1);

  function nextPage() {
    setPageNum((prev) => prev + 1);
  }
  // function resetPage() {
  //   setPageNum(1);
  //   console.log("reset____" + pageNum);
  // }

  //windowScrollListener
  const handleScroll = (e) => {
    if (
      window.innerHeight + e.target.documentElement.scrollTop + 1 >=
      e.target.documentElement.scrollHeight
    ) {
      nextPage();
    }
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
    setPageNum(1);
    console.log(pageNum);
    setPosts([]);
    loadFirst();
  }, [sectionName]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="posts">
      {posts.length > 0 && posts.map((post) => <Post {...post} />)}
    </div>
  );
}
