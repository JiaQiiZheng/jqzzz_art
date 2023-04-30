import React from "react";
import $ from "jquery";
import "./style.css";

const width = "100%";
const height = "100%;";
const backgroundColor = "ffffff";
const backgroundColorFullscreen = "ffffff";
const doAutoflipPages = "true";
const issuuEmbedCode = `<div style="position:relative;padding-top:max(60%,326px);height:0;width:100%"><iframe allow="clipboard-write" sandbox="allow-top-navigation allow-top-navigation-by-user-activation allow-downloads allow-scripts allow-same-origin allow-popups allow-modals allow-popups-to-escape-sandbox allow-forms" allowfullscreen="true" style="position:absolute;border:none;width:${width};height:${height};left:0;right:0;top:0;bottom:0;" src="https://e.issuu.com/embed.html?backgroundColor=%23${backgroundColor}&backgroundColorFullscreen=%23${backgroundColorFullscreen}&d=wateraslandbuilder&doAutoflipPages=${doAutoflipPages}&hideIssuuLogo=true&hideShareButton=true&u=jiaqizheng2523"></iframe></div>`;

export default function BaltimoreStudio_20230429() {
  var $html = $(`${issuuEmbedCode}`);
  var value = $html.prop("outerHTML");
  return (
    <div
      id="BaltimoreStudio_20230429"
      dangerouslySetInnerHTML={{ __html: value }}
    ></div>
  );
}
