import { Quill } from "react-quill";
import AttachmentBlot from "./AttachmentBlot";
import BaseHandler from "./BaseHandler";

Quill.register("blots/attachment", AttachmentBlot);

class AttachmentHandler extends BaseHandler {
  constructor(quill, options) {
    super(quill, options);
    this.handler = "attachment";
    this.applyForToolbar();
  }

  insertFileToEditor(url) {
    const el = document.getElementById(this.handlerId);
    console.log(el);
    if (el) {
      // el.removeAttribute("id");

      if (url) {
        const _filename = this.fileHolder.files[0].name;

        if (_filename && el.firstElementChild) {
          var fileNameSpan = document.createElement("span");
          fileNameSpan.textContent = _filename;
          el.appendChild(fileNameSpan);
        }
      }
    }
    return;
  }

  fileChanged() {
    const file = this.loadFile(this);

    if (!file) {
      console.warn(
        "[File not selected] File is missing, please try to select file again!"
      );
      return;
    }

    this.embedFile(file);
  }
}

export default AttachmentHandler;
