import React, { Component } from "react";
import ReactQuill, { Quill } from "react-quill";
// import ImageCompress from "quill-image-compress";
import ImageUploader from "quill-image-uploader";
import Counter from "./CustomizeQuill/Counter";
import { ImageBlot, CardEditableModule } from "./CustomizeQuill/Caption";
import AudioBlot, { EmbedAudioBlot } from "./CustomizeQuill/AudioBlot";
import { InsertIssuu } from "./CustomizeQuill/InsertIssuu";
import { setDriver } from "mongoose";

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
const CustomAudioIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
    <path d="M256 80C141.1 80 48 173.1 48 288V392c0 13.3-10.7 24-24 24s-24-10.7-24-24V288C0 146.6 114.6 32 256 32s256 114.6 256 256V392c0 13.3-10.7 24-24 24s-24-10.7-24-24V288c0-114.9-93.1-208-208-208zM80 352c0-35.3 28.7-64 64-64h16c17.7 0 32 14.3 32 32V448c0 17.7-14.3 32-32 32H144c-35.3 0-64-28.7-64-64V352zm288-64c35.3 0 64 28.7 64 64v64c0 35.3-28.7 64-64 64H352c-17.7 0-32-14.3-32-32V320c0-17.7 14.3-32 32-32h16z" />
  </svg>
);
function CustomEmbedAudio() {
  EmbedAudioBlot(this.quill);
}

//customize InsertIssuu
function CustomInsertIssuu() {
  InsertIssuu(this.quill);
}
const CustomInsertIssuuIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" id="pdf">
    <path d="M27.928 42.848a3.48 3.48 0 0 0-1.168-.976c-.47-.245-1.03-.368-1.68-.368a3.25 3.25 0 0 0-1.408.304c-.427.203-.779.528-1.056.977h-.032v-1.057h-2.16v11.169h2.273v-3.921h.032c.277.406.632.713 1.064.921.432.207.904.312 1.416.312.608 0 1.139-.117 1.592-.352.453-.235.832-.55 1.136-.944a4.07 4.07 0 0 0 .68-1.36 5.695 5.695 0 0 0 .224-1.6c0-.587-.075-1.149-.224-1.688a4.15 4.15 0 0 0-.689-1.417zm-1.456 4.016c-.064.319-.174.6-.328.84-.155.24-.357.435-.608.584-.251.149-.563.224-.936.224-.363 0-.672-.074-.928-.224a1.789 1.789 0 0 1-.616-.584 2.516 2.516 0 0 1-.336-.84 4.56 4.56 0 0 1-.104-.977c0-.341.032-.672.096-.991.064-.32.173-.603.328-.849.154-.245.357-.445.608-.6.25-.154.562-.232.936-.232.363 0 .669.078.92.232.251.154.456.357.616.607.16.251.274.536.344.856.069.32.104.645.104.976 0 .333-.032.658-.096.978zm5.44-5c-.459.239-.84.558-1.144.952a4.178 4.178 0 0 0-.688 1.367 5.579 5.579 0 0 0-.232 1.608c0 .576.077 1.131.232 1.664.154.533.384 1.006.688 1.416.304.411.69.736 1.16.976.469.24 1.014.36 1.632.36a3.49 3.49 0 0 0 1.464-.296c.432-.197.781-.521 1.048-.968h.032V50h2.16V38.576h-2.272v4.16h-.032a2.445 2.445 0 0 0-1.048-.92 3.256 3.256 0 0 0-1.4-.312c-.608 0-1.141.12-1.6.36zm3.136 1.576c.245.149.445.344.6.584.154.239.264.517.328.832.064.314.096.643.096.983 0 .342-.032.672-.096.992a2.7 2.7 0 0 1-.32.856c-.15.25-.349.45-.6.6-.251.149-.563.224-.936.224-.352 0-.654-.077-.904-.231a1.978 1.978 0 0 1-.624-.608 2.609 2.609 0 0 1-.36-.856 4.2 4.2 0 0 1-.112-.96c0-.342.034-.67.104-.984.069-.315.181-.595.336-.84.154-.245.36-.442.616-.592.256-.149.571-.225.944-.225.373.001.682.076.928.225zM40.472 50h2.272v-6.752h1.568v-1.521h-1.568v-.495c0-.342.067-.584.2-.729.133-.143.354-.216.664-.216.288 0 .565.016.832.048V38.64c-.192-.01-.39-.023-.592-.04a7.72 7.72 0 0 0-.608-.023c-.928 0-1.622.234-2.08.704-.458.469-.688 1.071-.688 1.808v.64h-1.36v1.521h1.36V50z"></path>
    <path d="M36 2H12v60h40V18L36 2zm14 58H14V4h20v16h16v40z"></path>
  </svg>
);

// Redo button icon component for Quill editor
const CustomUndo = () => (
  <svg viewBox="0 0 18 18">
    <polygon className="ql-fill ql-stroke" points="6 10 4 12 2 10 6 10" />
    <path
      className="ql-stroke"
      d="M8.09,13.91A4.6,4.6,0,0,0,9,14,5,5,0,1,0,4,9"
    />
  </svg>
);

// Redo button icon component for Quill editor
const CustomRedo = () => (
  <svg viewBox="0 0 18 18">
    <polygon className="ql-fill ql-stroke" points="12 10 14 12 16 10 12 10" />
    <path
      className="ql-stroke"
      d="M9.91,13.91A4.6,4.6,0,0,1,9,14a5,5,0,1,1,5-5"
    />
  </svg>
);

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
  toolbar: {
    container: "#toolbar",
    handlers: {
      undo: undoChange,
      redo: redoChange,
      custom_audio: CustomEmbedAudio,
      insert_issuu: CustomInsertIssuu,
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
        // console.log(data);
        fetch(`${process.env.REACT_APP_API_URL}/ql/image`, {
          method: "POST",
          body: data,
          credentials: "include",
        })
          .then((response) => response.json())
          .then((result) => {
            // console.log(result);
            resolve(result.cover);
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
      <button className="ql-insert_issuu">
        <CustomInsertIssuuIcon />
      </button>
    </span>
  </div>
);

export default QuillToolbar;
