import React, { Component, createRef, useRef, useState } from "react";
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
import { setOptions, create, getOptions, FileStatus } from "filepond";
import FilePondPluginImageResize from "filepond-plugin-image-resize";
import FilePondPluginImageTransform from "filepond-plugin-image-transform";

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
);

setOptions({
  // image preview setting:
  allowImagePreview: true,
  styleItemPanelAspectRatio: 0.5,
  // imagePreviewFilterItem: (fileItem) => !/gif/.test(fileItem.fileType),

  //image resize setting:
  imageResizeTargetWidth: 1200,
  imageTransformOutputQualityMode: "optional",
  imageResizeMode: "contain",
  allowImageResize: true,

  // image transform setting:
  imageTransformImageFilter: (fileItem) => !/image\/gif/.test(fileItem.type),

  // imageTransformAfterCreateBlob: (blob) =>
  //   new Promise((resolve) => {
  //     // do something with the blob, for instance send it to a custom compression alogrithm
  //     // return the blob to the plugin for further processing
  //     resolve(blob);
  //   }),

  forceRevert: true,

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
      data.append("fileIndex", metadata.fileIndex);
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
      const id = fieldName.split("/").pop();
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

          const file = new File([blob], data[2], {
            type: data[1],
          });

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
      fileIndex: 0,
      // fileObject: [],
      processed: false,
      componentDidMount: false,
      embedCode: "",
      iframeName: "",
      acceptFileType: [
        "jpg",
        "jpeg",
        "pdf",
        "png",
        "svg",
        "bmp",
        "gif",
        "json",
      ],
    };
    this.FilePondRef = createRef(null);
    this.button_removeAll_ref = createRef(null);
  }

  componentDidMount() {
    this.state.componentDidMount = true;
  }

  // callback methods
  handleInit() {
    var fileObjects = this.props.initialFiles;
    if (fileObjects) {
      var serverId = [];
      fileObjects.map((item) => serverId.push(item.serverId));
      var collection = [];
      fileObjects.forEach((item) => {
        collection.push({ source: item.serverId, options: { type: "limbo" } });
      });
      this.setState({ files: collection, serverId: serverId });
    }
  }

  handleUploadedFiles(deleteServerId) {
    var currentFiles = this.FilePondRef.current.getFiles().map((item) => {
      return {
        serverId: item.serverId,
        fileIndex: item.getMetadata().fileIndex,
      };
    });
    if (deleteServerId)
      currentFiles = currentFiles.filter(
        (item) => item.serverId !== deleteServerId
      );
    this.props.onUploadedFiles(currentFiles);
  }

  handleEmbedCode = () => {
    const blob = new Blob(
      [JSON.stringify({ embedCode: this.state.embedCode })],
      {
        type: "application/json",
      }
    );
    blob.name = `IFRAME_${this.state.iframeName}.json`;
    this.FilePondRef.current.addFile(blob);
  };

  handleIframeEmbed = () => {
    this.setState({ embedCode: "", iframeName: "" });
  };

  handleRemoveFiles = (isMount) => {
    if (isMount) {
      const btn = this.button_removeAll_ref.current;
      if (btn.confirmed) {
        clearTimeout(btn.timer);
        this.FilePondRef.current.removeFiles({ revert: true });
        btn.textContent = "Remove All Files";
        btn.confirmed = false;
      } else {
        btn.textContent = btn.dataset.confirm;
        // confrimed so trigger again then run if()
        btn.confirmed = true;
        btn.timer = setTimeout(() => {
          btn.confirmed = false;
          btn.textContent = "Remove All Files";
        }, 2000);
      }
    }
  };

  render() {
    return (
      <div className="App">
        <FilePond
          ref={this.FilePondRef}
          files={this.state.files}
          allowMultiple={true}
          allowReorder={true}
          maxFiles={100}
          name="filepond"
          labelIdle='Drag & Drop your files to Build a Booklet or <span class="filepond--label-action">Browse</span>'
          oninit={() => this.handleInit()}
          onaddfile={(err, fileItem) => {
            const type = fileItem
              ? fileItem.file.name.split(".").pop()
              : "unknown";
            var regex = new RegExp(this.state.acceptFileType.join("|"), "i");
            if (regex.test(type)) {
              document
                .getElementById("filepondInfo_show")
                .classList.add("filepondInfo_hide");
              if (type === "json") {
                this.handleIframeEmbed();
              }
            } else {
              document
                .getElementById("filepondInfo_show")
                .classList.remove("filepondInfo_hide");
              this.FilePondRef.current.removeFile(fileItem, { revert: true });
            }
          }}
          onupdatefiles={(fileItems) => {
            // Set currently active file objects to this.state
            this.setState({
              files: fileItems.map((fileItem) => fileItem.file),
            });
          }}
          onprocessfiles={() => {
            this.handleUploadedFiles();
          }}
          onprocessfile={(err, fileItem) => {
            var current = this.state.serverId;
            var addId = fileItem.serverId.split("/").pop();
            !current.includes(addId) &&
              current.push(fileItem.serverId.split("/").pop());
            this.state.serverId = current;

            // handle file order
            this.state.fileIndex += 1;
            fileItem.setMetadata("fileIndex", this.state.fileIndex, true);
            // const newFileObject = {
            //   serverId: fileItem.serverId,
            //   fileIndex: fileItem.getMetadata().fileIndex,
            // };
            // var currentFileObjects = this.state.fileObject;
            // currentFileObjects.push(newFileObject);
            // this.state.fileObject = currentFileObjects;
          }}
          onprocessfilerevert={(fileItem) => {
            const deleteServerId = fileItem.serverId;
            this.handleUploadedFiles(deleteServerId);
          }}
          onreorderfiles={(files, origin, target) => {
            // const fileOrder = [];
            // files.map((file) => {
            //   fileOrder.push(file.getMetadata().fileIndex);
            // });
            // var oldFileObjects = this.state.fileObject;
            // var newFileObjects = [];
            // for (var i = 1; i <= oldFileObjects.length; i++) {
            //   try {
            //     newFileObjects[i - 1] = oldFileObjects.find(
            //       (item) => item.fileIndex == fileOrder[i - 1]
            //     );
            //   } catch (error) {
            //     console.warn(error);
            //   }
            // }
            // this.state.fileObject = newFileObjects;
            this.handleUploadedFiles();
          }}
        />
        <div>
          {/* <input
            value={this.state.embedCode}
            type="embedCode"
            onChange={(ev) =>
              this.setState({
                embedCode: (this.state.embedCode = ev.target.value),
              })
            }
          /> */}
          {/* <button type="button" onClick={this.handleEmbedCode}>
            Embed Iframe
          </button> */}
          <div>
            {/* create new iframe */}
            <div className="createNewIframe">
              <div className="info">
                <p
                  className="filepondInfo_hide"
                  id="filepondInfo_show"
                >{`please upload valid files including: ${this.state.acceptFileType
                  .toString()
                  .replaceAll(",", ", ")}`}</p>
              </div>
              <div className="create">
                <div className="icon_add" onClick={this.handleEmbedCode}>
                  <link
                    rel="stylesheet"
                    href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@48,400,0,0"
                  />
                  <span className="material-symbols-outlined">add_circle</span>
                </div>
                <div className="input">
                  <input
                    className="input_IframeName"
                    type="iframeName"
                    value={this.state.iframeName}
                    onChange={(ev) =>
                      this.setState({
                        iframeName: (this.state.iframeName = ev.target.value),
                      })
                    }
                    placeholder="iframe name"
                  />
                  <input
                    className="input_EmbedCode"
                    type="embedCode"
                    value={this.state.embedCode}
                    onChange={(ev) =>
                      this.setState({
                        embedCode: (this.state.embedCode = ev.target.value),
                      })
                    }
                    placeholder="Input iframe embed code..."
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <button
          ref={this.button_removeAll_ref}
          id="button_filePond_removeAll"
          data-confirm="are you sure?"
          type="button"
          onClick={() => {
            this.handleRemoveFiles(this.state.componentDidMount);
          }}
        >
          Remove All Files
        </button>
      </div>
    );
  }
}

export default App;
