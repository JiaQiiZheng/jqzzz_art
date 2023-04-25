import React, { useState, Component } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

export default function QuickStart() {
  const [value, setValue] = useState("");
  return (
    <div>
      <ReactQuill theme="snow" value={value} onChange={setValue} />
    </div>
  );
}

export class MyComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: "",
    };
  }
  modules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [
        { list: "ordered" },
        { list: "bullet" },
        { indent: "-1" },
        { indent: "+1" },
      ],
      ["link", "image"],
      ["clean"],
    ],
  };
  formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "indent",
    "link",
    "image",
  ];
  render() {
    return (
      <div className="text-editor">
        <ReactQuill
          theme="snow"
          modules={this.modules}
          formats={this.formats}
        ></ReactQuill>
      </div>
    );
  }
}
