import { Quill } from "react-quill";
import AdobePdfViewer from "../PdfViewer/App";

let BlockEmbed = Quill.import("blots/block/embed");

export default class AudioBlot extends BlockEmbed {
  static create(url) {
    let node = super.create();
    node.setAttribute("src", url);
    node.setAttribute("controls", "");
    return node;
  }

  // static formats(node) {
  //   let format = {};
  //   if (node.hasAttribute("height")) {
  //     format.height = node.getAttribute("height");
  //   }
  //   if (node.hasAttribute("width")) {
  //     format.width = node.getAttribute("width");
  //   }
  //   return format;
  // }

  static value(node) {
    return node.getAttribute("src");
  }

  // format(name, value) {
  //   if (name === "height" || name === "width") {
  //     if (value) {
  //       this.domNode.setAttribute(name, value);
  //     } else {
  //       this.domNode.removeAttribute(name, value);
  //     }
  //   } else {
  //     super.format(name, value);
  //   }
  // }
}
AudioBlot.blotName = "audio";
AudioBlot.tagName = "audio";

export function EmbedAudioBlot(quill) {
  const cursorPosition = quill.getSelection().index;
  let url = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3";
  quill.insertEmbed(cursorPosition, "audio", url);
  quill.setSelection(cursorPosition + 1);
}

export function insertStar(quill) {
  const cursorPosition = quill.getSelection().index;
  quill.insertText(cursorPosition, "★");
  quill.setSelection(cursorPosition + 1);
}
