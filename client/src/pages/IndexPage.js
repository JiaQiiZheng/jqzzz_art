import Post from "../Post";
import { useEffect, useState } from "react";

export default function IndexPage() {
  //get section name
  const currentUrlArray = window.location.href.split("/");
  const sectionName = currentUrlArray[currentUrlArray.length - 1];
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/post/${sectionName}`).then(
      (response) => {
        response.json().then((posts) => {
          setPosts(posts);
        });
      }
    );
  }, [sectionName]);

  return (
    <div className="posts">
      {posts.length > 0 && posts.map((post) => <Post {...post} />)}
    </div>
  );
}
