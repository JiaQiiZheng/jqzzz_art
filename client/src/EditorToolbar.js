import React, { Component } from "react";
import ReactQuill, { Quill } from "react-quill";
import ImageCompress from "quill-image-compress";
import ImageUploader from "quill-image-uploader";
import Counter from "./CustomizeQuill/Counter";
import { ImageBlot, CardEditableModule } from "./CustomizeQuill/Caption";
import VideoBlot, { EmbedVideoBlot } from "./CustomizeQuill/VideoBlot";
import { Poll } from "./CustomizeQuill/Poll";

//pollExample
import defer from "lodash/defer";
import map from "lodash/map";

Quill.register("modules/imageCompress", ImageCompress);

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

//customize blot
Quill.register(VideoBlot);
function TestFunction() {
  // EmbedVideoBlot(this.quill);
  console.log(this.editorContainer);
}
//customize poll
Quill.register(
  {
    "formats/poll": Poll,
  },
  true
);

class PollEditor extends Component {
  constructor(quill, options) {
    super(quill);
    this.editor = null;
    this.editorContainer = React.createRef();
    this.state = {
      embedBlots: [],
    };
  }

  componentDidMount() {
    this.editor = new Quill(this.editorContainer.current, {
      placeholder: "Start typing",
      readOnly: false,
      formats: ["header", "poll"],
    });

    let blots = [];
    /** Listener to listen for custom format */
    this.editor.scroll.emitter.on("blot-mount", (blot) => {
      blots.push(blot);
      defer(() => {
        if (blots.length > 0) {
          this.onMount(...blots);
          blots = [];
        }
      });
    });
    this.editor.scroll.emitter.on("blot-unmount", this.onUnmount);

    const delta = {
      ops: [
        /** Bold Formatting */
        {
          insert: "Header 1",
        },
        {
          insert: "\n",
          attributes: {
            header: 1,
          },
        },
      ],
    };
    this.editor.setContents(delta);
  }

  onMount = (...blots) => {
    const embeds = blots.reduce(
      (memo, blot) => {
        memo[blot.id] = blot;
        return memo;
      },
      { ...this.state.embedBlots }
    );
    this.setState({ embedBlots: embeds });
  };

  onUnmount = (unmountedBlot) => {
    const { [unmountedBlot.id]: blot, ...embedBlots } = this.state.embedBlots;
    this.setState({ embedBlots });
  };

  renderPoll() {
    const range = this.editor.getSelection(true);
    const type = "poll";
    const data = {};
    /** Call pollFormat */
    this.editor.insertEmbed(range.index, type, data);
    console.log(this.editor.getContents());
  }

  render() {
    return (
      <>
        <div spellCheck={false} ref={this.editorContainer}>
          {map(this.state.embedBlots, (blot) => blot.renderPortal(blot.id))}
        </div>
        <button onClick={() => this.renderPoll()}>Poll</button>
      </>
    );
  }
}

Quill.register("modules/pollEditor", PollEditor);

const Test = () => <div>Test</div>;

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
      test: TestFunction,
    },
  },
  history: {
    delay: 500,
    maxStack: 500,
    userOnly: true,
  },
  imageCompress: {
    quality: 0.7,
    maxWidth: 2560,
    maxHeight: 2560,
    imageType: "image/jpeg",
    ignoreImageTypes: ["image/gif"],
    debug: true,
    suppressErrorLogging: false,
    insertIntoEditor: undefined,
  },
  counter: true,
  cardEditable: true,
  pollEditor: true,

  //imageUploadToServer:
  imageUploader: {
    upload: (file) => {
      return new Promise((resolve, reject) => {
        const data = new FormData();
        data.append("image", file);
        console.log(data);
        fetch(`${process.env.REACT_APP_API_URL}/ql/image`, {
          method: "POST",
          body: data,
          credentials: "include",
        })
          .then((response) => response.json())
          .then((result) => {
            console.log(result);
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
      {/* <button className="ql-test">
        <Test />
      </button> */}
    </span>
  </div>
);

export default QuillToolbar;
