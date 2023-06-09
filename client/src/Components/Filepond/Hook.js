import React, { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import "./style.css";

// Import React FilePond
import { FilePond, registerPlugin } from "react-filepond";

// Import FilePond styles
// import "filepond/dist/filepond.min.css";

// Import the Image EXIF Orientation and Image Preview plugins
// Note: These need to be installed separately
// `npm i filepond-plugin-image-preview filepond-plugin-image-exif-orientation --save`
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import { setOptions, create } from "filepond";

// Register the plugins
registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview);

setOptions({
  // handle upload
  server: {
    url: `${process.env.REACT_APP_API_URL}`,
    process: async function (
      fieldName,
      file,
      metadata,
      load,
      error,
      progress,
      abort
    ) {
      const data = new FormData();
      data.set("file", file);
      return await fetch(`${process.env.REACT_APP_API_URL}/filepond/upload`, {
        method: "POST",
        body: data,
        credentials: "include",
      })
        .then((response) => {
          return response.json();
        })
        .then((key) => {
          load(key);
        })
        .catch((err) => console.warn(err));
    },
    // handle delete
    revert: async function (
      fieldName,
      file,
      metadata,
      load,
      error,
      progress,
      abort
    ) {
      const id = fieldName.split("/").pop();
      return await fetch(
        `${process.env.REACT_APP_API_URL}/filepond/delete/${id}`,
        {
          method: "DELETE",
        }
      )
        .then((response) => {
          return response.json();
        })
        .then((result) => console.log(result))
        .catch((err) => console.warn(err));
    },
  },
});

// Our app
function App() {
  const [files, setFiles] = useState();

  const handleInit = () => {
    console.log("hook initialised!");
  };

  return (
    <div className="App">
      <FilePond
        files={files}
        onupdatefiles={setFiles}
        allowMultiple={true}
        maxFiles={100}
        // server={`${process.env.REACT_APP_API_URL}/attachment`}
        name="filepond" /* sets the file input name, it's filepond by default */
        labelIdle='Drag & Drop your files or <span class="filepond--label-action">Browse</span>'
        oninit={() => handleInit()}
      />
    </div>
  );
}

export default App;
