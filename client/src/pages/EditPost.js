import { useEffect, useState, useRef } from "react";
import { Navigate, useParams } from "react-router-dom";
import Editor from "../Editor";
import { Link } from "react-router-dom";
import Dropdown from "../Components/Dropdown/dropdown_edit";
import UploadButton from "../Components/UploadButton/UploadButton";

export default function EditPost() {
  //get section name
  const currentUrlArray = window.location.href.split("/");
  const sectionName = currentUrlArray[currentUrlArray.length - 3];

  const { id } = useParams();
  const [projectName, setProjectName] = useState("");
  const [projectNameData, setProjectNameData] = useState();
  const [isGif, setIsGif] = useState();
  const isGifRef = useRef();

  // get isGif info back from UploadButton component
  const handleFileExtCallback = (childData) => {
    setIsGif(childData === "gif");
    isGifRef.current = childData === "gif";
  };

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
        // remove all previous previews
        while (profile_preview.firstChild) {
          profile_preview.removeChild(profile_preview.lastElementChild);
          // profile_preview.innerHTML = "";
        }
        if (!isGifRef.current) {
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
        } else {
          let new_image = document.createElement("img");
          document.getElementById("profile_preview").appendChild(new_image);
          new_image.src = URL.createObjectURL(event.target.files[0]);

          //submit to the form
          setFiles(event.target.files[0]);
        }
      });
  }, []);

  // get currentProjectNameStatus from post data
  const currentProjectNameRef = useRef();
  fetch(`${process.env.REACT_APP_API_URL}/${sectionName}/post/` + id).then(
    (response) => {
      response.json().then((postInfo) => {
        currentProjectNameRef.current = postInfo.projectName;
      });
    }
  );

  const [selectedProjectName, setSelectedProjectName] = useState();
  useEffect(() => {
    setSelectedProjectName(currentProjectNameRef.current);
  }, []);

  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [files, setFiles] = useState("");
  const [redirect, setRedirect] = useState(false);

  // get current data info
  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/${sectionName}/post/` + id).then(
      (response) => {
        response.json().then((postInfo) => {
          setTitle(postInfo.title);
          setContent(postInfo.content);
          setSummary(postInfo.summary);
          //set current profile preview
          // const current_profile = createElement("img");
          let profile_preview = document.getElementById("profile_preview");
          let current_profile = document.createElement("img");
          current_profile.src = postInfo.cover;
          profile_preview.appendChild(current_profile);
        });
      }
    );
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

  async function updatePost(ev) {
    ev.preventDefault();
    const data = new FormData();
    data.set(
      "projectName",
      selectedProjectName ? selectedProjectName : currentProjectNameRef.current
    );
    data.set("title", title);
    data.set("summary", summary);
    data.set("content", content);
    data.set("id", id);
    if (files) {
      data.set("file", files);
    }
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/post/${sectionName}`,
      {
        method: "PUT",
        body: data,
        credentials: "include",
      }
    );
    if (response.ok) {
      setRedirect(true);
    }
  }

  if (redirect) {
    return <Navigate to={`/${sectionName}/post/` + id} />;
  }

  return (
    <form className="edit_form" onSubmit={updatePost}>
      {/* dropdown to select project name */}
      {Array.isArray(projectNameData) && projectNameData.length != 0 && (
        <Dropdown
          params={[
            projectNameData,
            currentProjectNameRef.current,
            handleProjectNameCallback,
          ]}
        />
      )}
      <input
        type="title"
        maxLength={60}
        placeholder={"Title"}
        value={title}
        onChange={(ev) => setTitle(ev.target.value)}
      />
      <input
        type="summary"
        maxLength={200}
        placeholder={"Summary"}
        value={summary}
        onChange={(ev) => setSummary(ev.target.value)}
      />
      {/* <input
        type="file"
        onChange={(ev) => {
          console.log(ev.target.files);
          ev.target.files[0].name.split(".").pop() === "gif"
            ? setFiles(ev.target.files)
            : setIsGif(false);
        }}
      /> */}
      {/* <input type="file" id="file" /> */}
      <UploadButton props={handleFileExtCallback} />
      <div id="profile_preview"></div>
      <Editor onChange={setContent} value={content} />
      <nav className="form_button">
        {/* <button style={{ marginTop: "2rem" }}>Update</button> */}
        <button>Update</button>
        <Link className="negative_button" to={`/${sectionName}/post/` + id}>
          <button>Back</button>
        </Link>
      </nav>
    </form>
  );
}
