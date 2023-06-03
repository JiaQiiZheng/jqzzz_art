import { useLocation } from "react-router-dom";
import Post from "../Post";
import { useEffect, useRef, useState } from "react";
import Turnjs5 from "../Components/TurnToBook/Turnjs5";

export default function IndexPage_Project() {
  //get section name
  const currentUrlArray = window.location.href.split("/");
  const projectName = currentUrlArray[currentUrlArray.length - 1].replaceAll(
    "%20",
    " "
  );
  const sectionName = currentUrlArray[currentUrlArray.length - 2];
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
        setPosts([
          ...currentPosts,
          ...posts.filter((item) => item.projectName === projectName),
        ]);
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
        setPosts([...posts].filter((item) => item.projectName === projectName));
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
    <div>
      <iframe
        className="turnjs_iframe_inserted"
        src={window.location.origin + "/test"}
        frameBorder="0"
      ></iframe>
      <div className="indexpage_project_name">{projectName}</div>
      <div className="posts">
        {posts.length > 0 && posts.map((post, i) => <Post key={i} {...post} />)}
      </div>
    </div>
  );
}
