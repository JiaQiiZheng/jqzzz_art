import React from "react";
import $ from "jquery";

export default function NewOrleansSketchBook() {
  let issuuEmbedCode = `<div style="position:relative;padding-top:max(60%,326px);height:0;width:100%"><iframe allow="clipboard-write" sandbox="allow-top-navigation allow-top-navigation-by-user-activation allow-downloads allow-scripts allow-same-origin allow-popups allow-modals allow-popups-to-escape-sandbox allow-forms" allowfullscreen="true" style="position:absolute;border:none;width:100%;height:100%;left:0;right:0;top:0;bottom:0;" src="https://e.issuu.com/embed.html?backgroundColor=%23ffffff&backgroundColorFullscreen=%23ffffff&d=issuupost&doAutoflipPages=true&hideIssuuLogo=true&hideShareButton=true&u=jiaqizheng2523"></iframe></div>`;
  var $html = $(`${issuuEmbedCode}`);
  var value = $html.prop("outerHTML");
  return <div dangerouslySetInnerHTML={{ __html: value }}></div>;
}
