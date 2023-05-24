import React from "react";
import { Link } from "react-router-dom";

const ProjectOutline = ({ name }) => {
  return (
    <div className="projectList">
      <div className="project">
        <Link className="project_link" to={name}>
          <h2 className="project_name">{name.toUpperCase()}</h2>
        </Link>
      </div>
    </div>
  );
};

export default ProjectOutline;
