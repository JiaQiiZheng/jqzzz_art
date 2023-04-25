import ReactQuill from "react-quill";
import React from "react";
import EditorToolBar, { modules, formats } from "./EditorToolbar";
import "./App.css";
import PollEditor from "./CustomizeQuill/PollEditor";

export default function Editor({ value, onChange }) {
  return (
    <div className="content">
      <EditorToolBar />
      <ReactQuill
        value={value}
        theme={"snow"}
        onChange={onChange}
        placeholder={"Edit your ideas..."}
        modules={modules}
        formats={formats}
      />
    </div>
  );
}
