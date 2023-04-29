import { Quill } from "react-quill";
import $ from "jquery";

export function InsertIssuu(quill) {
  const cursorPosition = quill.getSelection().index;
  console.log(cursorPosition);
  // const insertContent = "what" + " ";
  // quill.insertText(cursorPosition, insertContent);
  // console.log(insertContent.length);
  // quill.setSelection(cursorPosition + insertContent.length);
  let issuuEmbedCode = prompt("Please Enter Issuu Embed Code:");
  var $html = $(`${issuuEmbedCode}`);
  var value = $html.prop("outerHTML");
  // const delta = quill.clipboard.convert(value);
  // quill.setContents(delta, "silent");

  //according to quill docs, this is an official way to insert html
  quill.clipboard.dangerouslyPasteHTML(cursorPosition, value);
}
