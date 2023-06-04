import React, { Component } from "react";
import ReactQuill, { Quill } from "react-quill";
// import ImageCompress from "quill-image-compress";
import ImageUploader from "./CustomizeQuill/quill-image-uploader";
import Counter from "./CustomizeQuill/Counter";
import { ImageBlot, CardEditableModule } from "./CustomizeQuill/Caption";
import AudioBlot, { EmbedAudioBlot } from "./CustomizeQuill/AudioBlot";
import { InsertIframe } from "./CustomizeQuill/InsertIframe";

// import ui
import {
  CustomInsertIframeIcon,
  CustomAudioIcon,
  CustomRedo,
  CustomUndo,
} from "./assets/ui/UI_library";

// Quill registration:
// Quill.register("modules/imageCompress", ImageCompress);

//customize counter
Quill.register("modules/counter", Counter);

//customize caption
Quill.register(
  {
    // Other formats or modules
    "formats/image": ImageBlot,
    "modules/cardEditable": CardEditableModule,
  },
  true
);
//customize imageUploader
Quill.register("modules/imageUploader", ImageUploader);

//customize AudioBlot
Quill.register(AudioBlot);

function CustomEmbedAudio() {
  EmbedAudioBlot(this.quill);
}

//customize InsertIframe
function CustomInsertIframe() {
  InsertIframe(this.quill);
}

// Undo and redo functions for Custom Toolbar
function undoChange() {
  this.quill.history.undo();
}
function redoChange() {
  this.quill.history.redo();
}

// Add sizes to whitelist and register them
const Size = Quill.import("formats/size");
Size.whitelist = ["extra-small", "small", "medium", "large"];
Quill.register(Size, true);

// Add fonts to whitelist and register them
const Font = Quill.import("formats/font");
Font.whitelist = [
  "arial",
  "comic-sans",
  "courier-new",
  "georgia",
  "helvetica",
  "lucida",
];
Quill.register(Font, true);

// Modules object for setting up the Quill editor
export const modules = {
  clipboard: { matchVisual: false },
  toolbar: {
    container: "#toolbar",
    handlers: {
      undo: undoChange,
      redo: redoChange,
      custom_audio: CustomEmbedAudio,
      insert_iframe: CustomInsertIframe,
    },
  },
  history: {
    delay: 500,
    maxStack: 500,
    userOnly: true,
  },
  // imageCompress: {
  //   quality: 0.7,
  //   maxWidth: 2560,
  //   maxHeight: 2560,
  //   imageType: ["image/jpeg", "image/png"],
  //   ignoreImageTypes: ["image/gif"],
  //   debug: true,
  //   suppressErrorLogging: false,
  //   insertIntoEditor: undefined,
  // },
  counter: true,
  cardEditable: true,
  //imageUploadToServer:
  imageUploader: {
    upload: (file) => {
      return new Promise((resolve, reject) => {
        const data = new FormData();
        data.append("image", file);
        fetch(`${process.env.REACT_APP_API_URL}/ql/image`, {
          method: "POST",
          body: data,
          credentials: "include",
        })
          .then((response) => response.json())
          .then((result) => {
            var format = result.cover.split(".").pop();
            ["pdf"].includes(format) &&
              resolve("https://jqzzz.s3.amazonaws.com/1685780616737.png");
            ["jpg", "jpeg", "png"].includes(format) && resolve(result.cover);
            ["txt", "docx", "doc"].includes(format) &&
              resolve("https://jqzzz.s3.amazonaws.com/1685782627733.png");
          })
          .catch((error) => {
            reject("Upload failed");
            console.error("Error:", error);
          });
      });
    },
  },
};

// Formats objects for setting up the Quill editor
export const formats = [
  "header",
  "font",
  "size",
  "bold",
  "italic",
  "underline",
  "align",
  "strike",
  "script",
  "blockquote",
  "background",
  "list",
  "bullet",
  "indent",
  "link",
  "image",
  "video",
  "attachment",
  "color",
  "code-block",
  "imageBlot",
  "audio",
];

// Quill Toolbar component
export const QuillToolbar = () => (
  <div id="toolbar">
    <span className="ql-formats">
      <select className="ql-font" defaultValue="arial">
        <option value="arial">Arial</option>
        <option value="comic-sans">Comic Sans</option>
        <option value="courier-new">Courier New</option>
        <option value="georgia">Georgia</option>
        <option value="helvetica">Helvetica</option>
        <option value="lucida">Lucida</option>
      </select>
      <select className="ql-size" defaultValue="medium">
        <option value="extra-small">12px</option>
        <option value="small">14px</option>
        <option value="medium">16px</option>
        <option value="large">20px</option>
      </select>
      <select className="ql-header" defaultValue="3">
        <option value="1">Heading</option>
        <option value="2">Subheading</option>
        <option value="3">Normal</option>
      </select>
    </span>
    <span className="ql-formats">
      <button className="ql-bold" />
      <button className="ql-italic" />
      <button className="ql-underline" />
      <button className="ql-strike" />
    </span>
    <span className="ql-formats">
      <button className="ql-list" value="ordered" />
      <button className="ql-list" value="bullet" />
      <button className="ql-indent" value="-1" />
      <button className="ql-indent" value="+1" />
    </span>
    <span className="ql-formats">
      <button className="ql-script" value="super" />
      <button className="ql-script" value="sub" />
      <button className="ql-blockquote" />
      <button className="ql-direction" />
    </span>
    <span className="ql-formats">
      <select className="ql-align" />
      <select className="ql-color" />
      <select className="ql-background" />
    </span>
    <span className="ql-formats">
      <button className="ql-link" />
      <button className="ql-image" />
      <button className="ql-video" />
      <button className="ql-attachment" />
    </span>
    <span className="ql-formats">
      <button className="ql-formula" />
      <button className="ql-code-block" />
      <button className="ql-clean" />
    </span>
    <span className="ql-formats">
      <button className="ql-undo">
        <CustomUndo />
      </button>
      <button className="ql-redo">
        <CustomRedo />
      </button>
      <button className="ql-audio">
        <CustomAudioIcon />
      </button>
      <button className="ql-insert_iframe">
        <CustomInsertIframeIcon />
      </button>
    </span>
  </div>
);

export default QuillToolbar;
