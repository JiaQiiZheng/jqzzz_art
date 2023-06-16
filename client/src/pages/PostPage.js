import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { formatISO9075 } from "date-fns";
import { UserContext } from "../UserContext";
import { Link } from "react-router-dom";
import Image from "../image";
import Zmage from "react-zmage";
import * as ReactImprovement from "../Components/react-zmage/zmageImprovement";

const baseUrl = process.env.REACT_APP_API_URL;

// improvement of react zmage
function handleDoubleClickZoom() {
  document.getElementById("zmageControlZoom").click();
}
function handleEsc() {
  document.getElementById("zmageControlClose").click();
}
const handleBrowsing = (state) => {
  if (state) {
    document.getElementsByTagName("figure")[0].onclick = handleDoubleClickZoom;
  }
};
const handleZooming = (state) => {
  if (state) {
    document.getElementsByTagName("figure")[0].onclick = handleEsc;
  }
};

function img_find() {
  var imgs = document.getElementsByTagName("img");
  var imgSrc = [];
  var imgSet = [];
  for (var i = 1; i < imgs.length; i++) {
    imgSrc.push(imgs[i].src);
    imgSet.push({ src: imgs[i].src, alt: "not found" });
  }
  return [imgSrc, imgSet];
}

function img_defaultIndex(currentSrc, imgSrc) {
  for (var i = 0; i < imgSrc.length; i++) {
    if (currentSrc === imgSrc[i]) {
      console.log(i);
      return i;
    }
  }
}

function richTextClick(event) {
  if (event.target.nodeName == "IMG" || event.target.nodeName == "img") {
    const imgCurrentSrc = event.target.currentSrc;
    var [imgSrc, imgSet] = img_find();
    Zmage.browsing({
      src: imgCurrentSrc,
      preset: "desktop",
      set: imgSet,
      defaultPage: img_defaultIndex(imgCurrentSrc, imgSrc),
      onBrowsing: (state) => {
        ReactImprovement.handleBrowsing(state);
      },
      onZooming: (state) => {
        ReactImprovement.handleZooming(state);
      },
    });
  }
}

export default function PostPage() {
  const [postInfo, setPostInfo] = useState(null);
  const { userInfo } = useContext(UserContext);
  const { id } = useParams();

  function deletePublish() {
    const currentUrlArray = window.location.href.split("/");
    const id = currentUrlArray[currentUrlArray.length - 1];
    const sectionName = currentUrlArray[3];
    fetch(`${baseUrl}/${sectionName}/post/${id}`, { method: "DELETE" });
    var deleteFileKeys = JSON.parse(postInfo.uploadedFiles[0]).map((item) =>
      item.serverId.split("/").pop()
    );
    deleteFileKeys.forEach((key) => {
      fetch(`${process.env.REACT_APP_API_URL}/filepond/delete/${key}`, {
        method: "DELETE",
      })
        .then((response) => {
          return response.json();
        })
        .catch((err) => console.warn(err));
    });
  }

  useEffect(() => {
    //get section name
    const currentUrlArray = window.location.href.split("/");
    const sectionName = currentUrlArray[currentUrlArray.length - 3];
    fetch(`${baseUrl}/${sectionName}/post/${id}`).then((response) => {
      response.json().then((postInfo) => {
        setPostInfo(postInfo);
      });
    });
  }, []);

  // // focus on iframe when loaded
  // useEffect(() => {
  //   const iframe = document.getElementsByClassName("ql-video")[0];
  //   if (iframe) {
  //     console.log(iframe);
  //     iframe.focus();
  //   }
  //   return;
  // }, []);

  if (!postInfo) return "";

  return (
    <div>
      <iframe
        className="turnjs_iframe_inserted"
        src={window.location.origin + `/${id}`}
        frameBorder="0"
      ></iframe>
      <div className="post-page">
        {postInfo.projectName && (
          <div className="project_name">
            <Link
              to={`/${postInfo.section}/${postInfo.projectName}`}
              className="project_name_link"
            >
              {"ARCHIVE: "}
              <span>{postInfo.projectName.toUpperCase()}</span>
            </Link>
          </div>
        )}
        <div className="image">
          <Image src={postInfo.cover} alt="" />
        </div>
        <h1>{postInfo.title}</h1>
        <time>{formatISO9075(new Date(postInfo.createdAt)).split(" ")[0]}</time>
        <div className="author">by @{postInfo.author.username}</div>
        {userInfo.id === postInfo.author._id && (
          <div className="edit-row">
            <Link
              className="edit-btn"
              to={`/${postInfo.section}/edit/${postInfo._id}`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                />
              </svg>
              Edit
            </Link>
            <Link
              onClick={deletePublish}
              className="delete-btn"
              to={`/${postInfo.section}`}
            >
              Delete
            </Link>
          </div>
        )}

        <div
          onClick={richTextClick}
          className="content"
          dangerouslySetInnerHTML={{ __html: postInfo.content }}
        />
      </div>
    </div>
  );
}
