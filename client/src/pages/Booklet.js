import React, { useEffect, useState } from "react";
import Turnjs5 from "../Components/TurnToBook/Turnjs5";
import { useParams } from "react-router-dom";
import Turnjs5_Iframe from "../Components/TurnToBook/Turnjs5_Iframe";

const baseUrl = window.location.origin;

const Booklet = ({ params }) => {
  const [postInfo, setPostInfo] = useState(null);
  const bookId = useParams();
  const id = params;

  useEffect(() => {
    fetch(`${baseUrl}/${id}`)
      .then((response) => {
        response.json();
      })
      .then((postInfo) => {
        console.log(postInfo);
      });
  });

  return (
    <div className="turnjs5_iframe">
      <iframe
        className="turnjs_iframe_inserted"
        src={`${baseUrl}/${id}`}
        frameBorder="0"
      >
        <Turnjs5_Iframe />
      </iframe>
    </div>
  );
};

export default Booklet;
