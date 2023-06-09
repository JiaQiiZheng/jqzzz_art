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
import { ChecksumAlgorithm } from "@aws-sdk/client-s3";

// Register the plugins
registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview);

setOptions({
  allowImagePreview: true,
  styleItemPanelAspectRatio: 0.5,
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
        .catch((err) => console.warn(err));
    },

    // handle load

    // handle restore
    restore: async function (fieldName, load, error, progress, abort, headers) {
      const id = fieldName;
      await fetch(`${process.env.REACT_APP_API_URL}/filepond/restore/${id}`, {
        method: "GET",
      })
        .then((response) => {
          console.log(response);
          return response.blob();
        })
        .then((blob) => {
          progress(true, 0, 1024);
          load(blob);
        })
        .catch(error("something wrong with initial loading"));
    },
    // load: (fieldName, load, error, progress, abort, headers) => {
    //   const id = fieldName;
    //   const response = fetch(
    //     `${process.env.REACT_APP_API_URL}/filepond/load/${id}`,
    //     {
    //       method: "GET",
    //     }
    //   );

    //   error("something wrong with initial loading");

    //   // headers(headersString);

    //   // progress(true, 0, 1024);

    //   load(response);

    //   // Should expose an abort method so the request can be cancelled
    //   return {
    //     abort: () => {
    //       // User tapped cancel, abort our ongoing actions here

    //       // Let FilePond know the request has been cancelled
    //       abort();
    //     },
    //   };
    // },
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
