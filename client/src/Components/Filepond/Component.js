import React, { Component, useState } from "react";
import ReactDOM from "react-dom";
import "./style.css";

// Import React FilePond
import { FilePond, registerPlugin } from "react-filepond";

// Import FilePond styles
import "filepond/dist/filepond.min.css";

// Import the Image EXIF Orientation and Image Preview plugins
// Note: These need to be installed separately
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import { setOptions, create, getOptions } from "filepond";
import FilePondPluginImageResize from "filepond-plugin-image-resize";
import FilePondPluginImageTransform from "filepond-plugin-image-transform";
// import FilePondPluginImageCrop from "filepond-plugin-image-crop";

// helper
const unit8ToBase64 = (arr) =>
  btoa(
    Array(arr.length)
      .fill("")
      .map((_, i) => String.fromCharCode(arr[i]))
      .join("")
  );

const readFileAsDataUrl = (file) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onloadend = () => {
    console.log(reader.result);
  };
};

// Register the plugins
registerPlugin(
  FilePondPluginImageExifOrientation,
  FilePondPluginImagePreview,
  FilePondPluginImageResize,
  FilePondPluginImageTransform
  // FilePondPluginImageCrop
);

setOptions({
  // image preview setting:
  allowImagePreview: true,
  styleItemPanelAspectRatio: 0.5,

  //image resize setting:
  imageResizeTargetWidth: 1200,
  imageTransformAfterCreateBlob: (blob) =>
    new Promise((resolve) => {
      // do something with the blob, for instance send it to a custom compression alogrithm
      // return the blob to the plugin for further processing
      resolve(blob);
    }),

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
      data.set("originalname", file.name);
      data.append("mimetype", file.type);
      return await fetch(`${process.env.REACT_APP_API_URL}/filepond/upload`, {
        method: "POST",
        body: data,
        credentials: "include",
        headers: { "Content-Disposition": "inline" },
      })
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          const [key, name, url] = data;
          load(key);
          // return {
          //   abort: () => {
          //     abort();
          //   },
          // };
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
        .catch((err) => console.warn(err));
    },

    // handle load
    load: (source, load, error, progress, abort, headers) => {
      const id = source;
      fetch(`${process.env.REACT_APP_API_URL}/filepond/restore/${id}`, {
        method: "GET",
      })
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          const unit8Array = Object.values(data[0]);
          const blob = new Blob([unit8Array], { type: data[1] });
          return blob;
        })
        .then((file) => {
          load(file);
        });
    },

    // handle restore
    restore: async function (fieldName, load, error, progress, abort, headers) {
      const id = fieldName;
      await fetch(`${process.env.REACT_APP_API_URL}/filepond/restore/${id}`, {
        method: "GET",
        // headers: { "Content-Disposition": "inline" },
      })
        // solution_1
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          // soluton_1: use base 64
          const encodedBase64 = data[0];

          const byteString = atob(encodedBase64);
          var arrayBuffer = new ArrayBuffer(byteString.length);
          var uint8Array = new Uint8Array(arrayBuffer);
          for (var i = 0; i < byteString.length; i++) {
            uint8Array[i] = byteString.charCodeAt(i);
          }
          const blob = new Blob([arrayBuffer], { type: data[1] });

          // solution_2:use uint8Array
          // const blob = new Blob([arrayBuffer], { type: data[1] });

          const file = new File([blob], data[2], { type: data[1] });

          return file;
        })
        .then((file) => {
          load(file);
        });

      // solution_2
      // .then((response) => {
      //   return response.blob();
      // })
      // .then((blob) => load(blob));
    },
  },
});

// Our app
class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      // Set initial files, type 'local' means this is a file
      // that has already been uploaded to the server (see docs)
      files: [],
      serverId: [],
    };
  }

  // callback methods
  handleInit() {
    var fileNames = this.props.initialFiles;
    var collection = [];
    fileNames.forEach((name) => {
      collection.push({ source: name, options: { type: "limbo" } });
    });
    this.setState({ files: collection, serverId: fileNames });
  }

  handleUploadedFiles(deleteServerId) {
    var current = this.state.serverId;
    if (deleteServerId)
      this.state.serverId = current.filter((id) => {
        return id !== deleteServerId;
      });
    this.props.onUploadedFiles(this.state.serverId);
  }

  render() {
    return (
      <div className="App">
        <FilePond
          ref={(ref) => (this.pond = ref)}
          files={this.state.files}
          allowMultiple={true}
          allowReorder={true}
          maxFiles={100}
          name="filepond"
          labelIdle='Drag & Drop your files to Build a Booklet or <span class="filepond--label-action">Browse</span>'
          oninit={() => this.handleInit()}
          onupdatefiles={(fileItems) => {
            // Set currently active file objects to this.state
            this.setState({
              files: fileItems.map((fileItem) => fileItem.file),
            });
          }}
          onprocessfile={(err, fileItem) => {
            var current = this.state.serverId;
            var addId = fileItem.serverId.split("/").pop();
            !current.includes(addId) &&
              current.push(fileItem.serverId.split("/").pop());
            this.state.serverId = current;
            this.handleUploadedFiles();
          }}
          onprocessfilerevert={(fileItem) => {
            const deleteServerId = fileItem.serverId.split("/").pop();
            this.handleUploadedFiles(deleteServerId);
          }}
        />
      </div>
    );
  }
}

export default App;
