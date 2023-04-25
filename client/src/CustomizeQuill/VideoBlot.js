import { Quill } from "react-quill";
import AdobePdfViewer from "../PdfViewer/App";

let BlockEmbed = Quill.import("blots/block/embed");

export default class VideoBlot extends BlockEmbed {
  static create(url) {
    let node = super.create();
    node.setAttribute("src", url);
    node.setAttribute("frameborder", "0");
    node.setAttribute("allowfullscreen", true);
    return node;
  }

  static formats(node) {
    let format = {};
    if (node.hasAttribute("height")) {
      format.height = node.getAttribute("height");
    }
    if (node.hasAttribute("width")) {
      format.width = node.getAttribute("width");
    }
    return format;
  }

  static value(node) {
    return node.getAttribute("src");
  }

  format(name, value) {
    if (name === "height" || name === "width") {
      if (value) {
        this.domNode.setAttribute(name, value);
      } else {
        this.domNode.removeAttribute(name, value);
      }
    } else {
      super.format(name, value);
    }
  }
}
VideoBlot.blotName = "video";
VideoBlot.tagName = "iframe";

export function EmbedVideoBlot(quill) {
  let range = quill.getSelection(true);
  quill.insertText(range.index, "\n", Quill.sources.USER);
  let url = "https://www.youtube.com/embed/QHH3iSeDBLo?showinfo=0";
  quill.insertEmbed(range.index + 1, "video", url, Quill.sources.USER);
  quill.formatText(range.index + 1, 1, { height: "170", width: "400" });
  quill.setSelection(range.index + 2, Quill.sources.SILENT);
  // let url = "https://www.youtube.com/embed/QHH3iSeDBLo?showinfo=0";
  // quill.insertEmbed(0, "video", url, Quill.sources.USER);
}
