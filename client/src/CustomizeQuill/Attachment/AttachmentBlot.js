import { Quill } from "react-quill";

let BlockEmbed = Quill.import("blots/block/embed");

class AttachmentBlot extends BlockEmbed {
  static create(value) {
    let href;
    let id;

    const arr = `${value}`.split("ID_SPLIT_FLAG");
    if (arr.length > 1) {
      id = arr[0];
      console.log(id);
      href = arr[1];
    } else {
      href = value;
    }

    let node = super.create("div");
    if (typeof href === "string") {
      node.setAttribute("href", href);
      node.setAttribute("id", id);
      node.contentEditable = false;
      console.log(node);
    }

    return node;
  }
  static value(node) {
    return node.getAttribute("href");
  }
  static format(node) {
    return node.getAttribute("format");
  }
}

AttachmentBlot.tagName = "div";
AttachmentBlot.blotName = "attachment";
AttachmentBlot.className = "ql-attachment-blot";

export default AttachmentBlot;
