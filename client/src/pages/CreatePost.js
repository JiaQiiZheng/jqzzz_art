import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import Editor from "../Editor";
import { Link } from "react-router-dom";
import Dropdown from "../Components/Dropdown/dropdown";
import UploadButton from "../Components/UploadButton/UploadButton";

export default function CreatePost() {
  //get section name
  const currentUrlArray = window.location.href.split("/");
  const sectionName = currentUrlArray[currentUrlArray.length - 2];

  const [projectName, setProjectName] = useState();
  const [projectNameData, setProjectNameData] = useState();
  const [selectedProjectName, setSelectedProjectName] = useState();
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [files, setFiles] = useState("");
  const [redirect, setRedirect] = useState(false);

  //compress upload profile
  useEffect(() => {
    const WIDTH = 2000;
    let input = document.getElementById("upload_file");
    let profile_preview = document.getElementById("profile_preview");
    let urlToFile = (url) => {
      let arr = url.split(",");
      let mime = arr[0].match(/:(.*?);/)[1];
      let data = arr[1];
      // decrypt data
      let dataStr = atob(data);
      let n = dataStr.length;
      let dataArr = new Uint8Array(n);
      while (n--) {
        dataArr[n] = dataStr.charCodeAt(n);
      }
      let file = new File([dataArr], "CompressedFile.jpg", { type: mime });
      return file;
    };

    input &&
      input.addEventListener("change", (event) => {
        let image_file = event.target.files[0];
        let reader = new FileReader();
        reader.readAsDataURL(image_file);
        reader.onload = (event) => {
          let image_url = event.target.result;
          let image = document.createElement("img");
          image.src = image_url;
          image.onload = (e) => {
            let canvas = document.createElement("canvas");
            let ratio = WIDTH / e.target.width;
            canvas.width = WIDTH;
            canvas.height = e.target.height * ratio;

            // remove all previous previews
            while (profile_preview.firstChild) {
              profile_preview.removeChild(profile_preview.lastElementChild);
              // wrapper.innerHTML = "";
            }

            //draw
            const context = canvas.getContext("2d");
            context.drawImage(image, 0, 0, canvas.width, canvas.height);
            let new_image_url = context.canvas.toDataURL("image/jpeg", 90);
            let new_image = document.createElement("img");

            document.getElementById("profile_preview").appendChild(new_image);
            new_image.src = new_image_url;

            //submit to the form
            setFiles(urlToFile(new_image_url));
          };
        };
      });
  }, []);

  // get projectName list from backend
  useEffect(() => {
    fetch(
      `${process.env.REACT_APP_API_URL}/post/${sectionName}/projectNames`
    ).then((response) => {
      response.json().then((projectNameArray) => {
        setProjectName(projectNameArray);
      });
    });
  }, []);

  useEffect(() => {
    const itemArray = [];
    if (Array.isArray(projectName)) {
      for (let i = 0; i < projectName.length; i++) {
        itemArray.push({ id: i, projectName: projectName[i] });
      }
    }
    setProjectNameData(itemArray);
  }, [projectName]);

  // get data back from dropdown component
  const handleProjectNameCallback = (childData) => {
    setSelectedProjectName(childData);
  };

  async function createNewPost(ev) {
    const data = new FormData();
    data.set("projectName", selectedProjectName);
    data.set("title", title);
    data.set("summary", summary);
    data.set("content", content);
    data.set("file", files);
    data.set("section", sectionName);
    ev.preventDefault();
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/post/${sectionName}`,
      {
        method: "POST",
        body: data,
        credentials: "include",
      }
    );
    if (response.ok) {
      setRedirect(true);
    }
  }

  if (redirect) {
    return <Navigate to={`/${sectionName}`} />;
  }

  return (
    <form className="edit_form" onSubmit={createNewPost}>
      {/* dropdown to select project name */}
      {Array.isArray(projectNameData) && projectNameData.length != 0 && (
        <Dropdown params={[projectNameData, handleProjectNameCallback]} />
      )}
      <input
        type="title"
        placeholder={"Title"}
        value={title}
        onChange={(ev) => setTitle(ev.target.value)}
      />
      <input
        type="summary"
        placeholder={"Summary"}
        value={summary}
        onChange={(ev) => setSummary(ev.target.value)}
      />
      {/*restyle default file upload button*/}
      {/* <input type="file" id="file" className="hidden" /> */}
      <UploadButton />
      {/*restyle default file upload button*/}

      <div id="profile_preview"></div>
      <Editor value={content} onChange={setContent} />
      {/* <Editor_test value={content} onChange={setContent} /> */}
      <nav className="form_button">
        <button className="positive_button">Create</button>
        <Link className="negative_button" to="/">
          <button>Back</button>
        </Link>
      </nav>
    </form>
  );
}
