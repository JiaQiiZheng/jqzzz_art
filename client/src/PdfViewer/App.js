import ReactViewAdobe, { AdobeReactView } from "react-adobe-embed";
import "./App.css";

export default function App() {
  return (
    <div className="pdfViewer">
      <ReactViewAdobe
        previewConfig={{
          showZoomControl: false,
          showAnnotationTools: false,
          defaultViewMode: "TWO_COLUMN_FIT_PAGE",
          showDownloadPDF: false,
          showPrintPDF: true,
          showLeftHandPanel: false,
          enableLinearization: false,
          showFullScreen: true,
          showDownloadPDF: false,
          showBookmarks: false,
          embedMode: "SIZED_CONTAINER",
        }}
        config={{
          /**
         * Feel free to use this api key, it only works for http://localhost 
          so I don't care if you use it. It won't work for http://localhost:3000, 
          it needs to be http://localhost:80 or https://localhost:443.
          */
          clientId: "1e680a2462f046418ad046eb11b2bfe8",
          divId: "pdf-div",
          /**
           * You can use this URL too, it only will work for localhost as well.
           */
          url: "https://jqzzz.s3.amazonaws.com/1681940740260.pdf",
          fileMeta: {
            fileName: "WaterAsLandbuilder.pdf",
            title: "TBD",
          },
        }}
      />
    </div>
  );
}
