import { Quill } from "react-quill";
import $ from "jquery";

export function InsertIssuu(quill) {
  // const cursorPosition = quill.getSelection().index;
  // const insertContent = "what" + " ";
  // quill.insertText(cursorPosition, insertContent);
  // console.log(insertContent.length);
  // quill.setSelection(cursorPosition + insertContent.length);
  let issuuEmbedCode = prompt("Please Enter Issuu Embed Code:");
  var $html = $(`${issuuEmbedCode}`);
  var value = $html.prop("outerHTML");
  const delta = quill.clipboard.convert(value);
  quill.setContents(delta, "silent");
}
