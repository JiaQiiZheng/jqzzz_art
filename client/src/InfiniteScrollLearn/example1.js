import React, { useState, useRef, useCallback } from "react";
import usePosts from "./hooks/usePosts";
import Post from "./Post";

const Example1 = () => {
  const [pageNum, setPageNum] = useState(1);
  const { isLoading, isError, error, results, hasNextPage } = usePosts(pageNum);

  const intObserver = useRef();
  const lastPostRef = useCallback(
    (post) => {
      if (isLoading) return;
      if (intObserver.current) intObserver.current.disconnect();
      intObserver.current = new IntersectionObserver((posts) => {
        if (posts[0].isIntersecting && hasNextPage) {
          console.log("We're near last post!");
          setPageNum((prev) => prev + 1);
        }
      });
      if (post) intObserver.current.observe(post);
    },
    [isLoading, hasNextPage]
  );

  if (isError) return <p className="center">Error: {error.message}</p>;

  const content = results.map((post, i) => {
    if (results.length === i + 1) {
      return <Post ref={lastPostRef} key={post.id} post={post} />;
    }
    return <Post key={post.id} post={post} />;
  });

  return (
    <div>
      <h1>Infinite Query</h1>
      {content}
      {isLoading && <p className="center">Loading more Posts...</p>}
      <p>Back to Top</p>
    </div>
  );
};

export default Example1;
