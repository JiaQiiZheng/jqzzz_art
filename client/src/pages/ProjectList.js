import React, { useState, useEffect } from "react";
import ProjectOutline from "./ProjectOutline";

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
      {/* {posts.length > 0 && posts.map((post, i) => <Post key={i} {...post} />)} */}
      {projectName.length > 0 &&
        projectName.map((project) => (
          <ProjectOutline key={project} name={project} />
        ))}
    </div>
  );
};

export default ProjectList;
