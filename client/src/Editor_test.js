import React, { Component } from "react";
import ReactQuill, { Quill } from "react-quill";

import ImageUploader from "quill-image-uploader";

Quill.register("modules/imageUploader", ImageUploader);

export default function Editor_test({ value, onChange }) {
  const modules = {
    toolbar: [["bold", "italic", "image"]],
    imageUploader: {
      upload: (file) => {
        return new Promise((resolve, reject) => {
          const formData = new FormData();
          formData.append("image", file);

          const url = `${process.env.REACT_APP_API_URL}/post/programming`;
          fetch(url, {
            method: "POST",
            body: formData,
            credentials: "include",
          })
            .then((response) => response.json())
            .then((result) => {
              console.log(result);
              resolve(result.data.url);
              console.log(result.data.url);
            })
            .catch((error) => {
              reject("Upload failed");
              console.error("Error:", error);
            });
        });
      },
    },
  };

  const formats = ["header", "bold", "italic", "image"];

  return (
    <div className="content">
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
