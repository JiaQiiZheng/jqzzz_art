import React, { useState, useEffect } from "react";
import ProjectOutline from "./ProjectOutline";
import Turnjs5 from "../Components/TurnToBook/Turnjs5";

const ProjectList = () => {
  //get section name
  const currentUrlArray = window.location.href.split("/");
  const sectionName = currentUrlArray[currentUrlArray.length - 1];
  // get projectName list from backend
  const [projectName, setProjectName] = useState([]);
  useEffect(() => {
    fetch(
      `${process.env.REACT_APP_API_URL}/post/${sectionName}/projectNames`
    ).then((response) => {
      response.json().then((projectNameArray) => {
        setProjectName(projectNameArray);
      });
    });
  }, [sectionName]);

  return (
    <div>
      <iframe
        className="turnjs_book_iframe"
        src="http://localhost:3000/test"
        frameBorder="0"
      ></iframe>
      {/* {posts.length > 0 && posts.map((post, i) => <Post key={i} {...post} />)} */}
      <div className="archiveList">
        {projectName.length > 0 &&
          projectName.map((project) => (
            <ProjectOutline key={project} name={project} />
          ))}
      </div>
    </div>
  );
};

export default ProjectList;
