import Post from "../Post";
import { useEffect, useState } from "react";
import Zmage from "react-zmage";

export default function IndexPage() {
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/post`).then((response) => {
      response.json().then((posts) => {
        setPosts(posts);
      });
    });
  }, []);
  return (
    <div className="posts">
      {posts.length > 0 && posts.map((post) => <Post {...post} />)}
      <div className="jiujiu">
        <Zmage
          src="https://alpha.aeon.co/images/acd6897d-9849-4188-92c6-79dabcbcd518/header_essay-final-gettyimages-685469924.jpg"
          alt=""
          set={[
            {
              src: "https://alpha.aeon.co/images/acd6897d-9849-4188-92c6-79dabcbcd518/header_essay-final-gettyimages-685469924.jpg",
            },
            {
              src: "https://static.independent.co.uk/2022/05/18/09/newFile-3.jpg",
            },
            {
              src: "https://i.guim.co.uk/img/media/fe1e34da640c5c56ed16f76ce6f994fa9343d09d/0_174_3408_2046/master/3408.jpg?width=1200&height=900&quality=85&auto=format&fit=crop&s=0d3f33fb6aa6e0154b7713a00454c83d",
            },
            {
              src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRnxL-jL4KbJfT7Zgk9xVhSvqqieOiLGou11YUXBgY_R258mBHkmxG3O7j2LCTQoIK1q8SpVCgATjI&usqp=CAU&ec=48600112",
            },
          ]}
        />
      </div>
    </div>
  );
}
