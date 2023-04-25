import React, { useCallback, useEffect, useRef } from "react";
import { Quill } from "react-quill";
import "quill/dist/quill.snow.css";
// import "./style.css";

const TOOLBAR_OPTIONS = [
  [{ header: [1, 2, 3, 4, 5, 6, false] }],
  [{ font: [] }],
  [{ list: "ordered" }, { list: "bullet" }],
  ["bold", "italic", "underline"],
  [{ color: [] }, { background: [] }],
  [{ script: "sub" }, { script: "super" }],
  [{ align: [] }],
  ["image", "blockquote", "code-block"],
  ["clean"],
];

export default function TextEditor() {
  // //useCallback
  const wrapperRef = useCallback((wrap) => {
    if (wrap == null) {
      return;
    }
    wrap.innerHTML = "";
    const editor = document.createElement("div");
    wrap.append(editor);
    new Quill(editor, { theme: "snow", modules: { toolbar: TOOLBAR_OPTIONS } });
  }, []);
  return <div id="container" ref={wrapperRef}></div>;
}
