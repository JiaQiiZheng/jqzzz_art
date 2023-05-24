import { useEffect, useState, useRef } from "react";
import { Navigate, useParams } from "react-router-dom";
import Editor from "../Editor";
import { Link } from "react-router-dom";
import Dropdown from "../Components/Dropdown/dropdown_edit";

export default function EditPost() {
  //get section name
  const currentUrlArray = window.location.href.split("/");
  const sectionName = currentUrlArray[currentUrlArray.length - 3];

  const { id } = useParams();
  const [projectName, setProjectName] = useState("");
  const [projectNameData, setProjectNameData] = useState();

  // get currentProjectNameStatus from post data
  const currentProjectNameRef = useRef();
  fetch(`${process.env.REACT_APP_API_URL}/${sectionName}/post/` + id).then(
    (response) => {
      response.json().then((postInfo) => {
        currentProjectNameRef.current = postInfo.projectName;
      });
    }
  );

  const [selectedProjectName, setSelectedProjectName] = useState(
    currentProjectNameRef.current
  );
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
    data.set("projectName", selectedProjectName);
    data.set("title", title);
    data.set("summary", summary);
    data.set("content", content);
    data.set("id", id);
    if (files?.[0]) {
      data.set("file", files?.[0]);
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
      <input type="file" onChange={(ev) => setFiles(ev.target.files)} />
      <Editor onChange={setContent} value={content} />
      <nav className="form_button">
        {/* <button style={{ marginTop: "2rem" }}>Update</button> */}
        <button>Update</button>
        <Link className="negative_button" to="/">
          <button>Back</button>
        </Link>
      </nav>
    </form>
  );
}
