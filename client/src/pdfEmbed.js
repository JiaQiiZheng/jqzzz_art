import React from "react";

export default function pdfEmbed() {
  return (
    <div style="left: 0px; width: 100%; height: 0px; position: relative; padding-bottom: 75%;">
      <div
        data-url="https://issuu.com/jiaqiz/docs/wateraslandbuilder_compressed"
        style="top: 0px; left: 0px; width: 100%; height: 100%; position: absolute;"
        class="issuuembed"
      ></div>
      <script
        type="text/javascript"
        src="//e.issuu.com/embed.js"
        async="true"
      ></script>
    </div>
  );
}
