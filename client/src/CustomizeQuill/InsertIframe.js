import { Quill } from "react-quill";
import $ from "jquery";

export function InsertIframe(quill) {
  const cursorPosition = quill.getSelection().index;
  // const insertContent = "what" + " ";
  // quill.insertText(cursorPosition, insertContent);
  // console.log(insertContent.length);
  // quill.setSelection(cursorPosition + insertContent.length);
  let iframeEmbedCode = prompt("Please Enter Iframe Embed Code:");
  var $html = $(`${iframeEmbedCode}`);
  var value = $html.prop("outerHTML");
  // const delta = quill.clipboard.convert(value);
  // quill.setContents(delta, "silent");

  //according to quill docs, this is an official way to insert html
  quill.clipboard.dangerouslyPasteHTML(cursorPosition, value);
}
