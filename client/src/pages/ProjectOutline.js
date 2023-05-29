import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import LazyImage from "../Components/LazyLoading/component/LazyImage/LazyImage";
import { data } from "../Components/LazyLoading/constant/data";
import Card from "../Learn/IntersectionObserver/card";
import LoadProjectData from "../Components/LazyLoading/component/LazyImage/LoadProjectData";

const ProjectOutline = ({ name }) => {
  return (
    <div className="project_info">
      <div className="projectList">
        <div className="project">
          <Link className="project_link" to={name}>
            <h2 className="project_name">{name.toUpperCase()}</h2>
          </Link>
        </div>
      </div>
      <p className="project_brief">intro</p>
      <div className="lazy-images-container">
        <LoadProjectData props={name} />
      </div>
    </div>
  );
};

export default ProjectOutline;
