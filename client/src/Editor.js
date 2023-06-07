import ReactQuill from "react-quill";
import React from "react";
import EditorToolBar, { modules, formats } from "./EditorToolbar";
import "./App.css";

export default function Editor({ value, onChange }) {
  return (
    <div className="content">
      <EditorToolBar />
      <ReactQuill
        value={value}
        theme={"snow"}
        onChange={onChange}
        placeholder={"How's going?"}
        modules={modules}
        formats={formats}
      />
    </div>
  );
}
