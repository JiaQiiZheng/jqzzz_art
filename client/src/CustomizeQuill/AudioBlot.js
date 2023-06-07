import { Quill } from "react-quill";

let BlockEmbed = Quill.import("blots/block/embed");

export class AudioBlot extends BlockEmbed {
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
  let url = prompt("Please Enter Audio Url:");
  const cursorPosition = quill.getSelection().index;
  quill.insertEmbed(cursorPosition, "audio", url);
  quill.setSelection(cursorPosition + 1);
}
