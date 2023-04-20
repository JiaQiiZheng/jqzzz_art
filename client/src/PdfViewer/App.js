import ReactViewAdobe, { AdobeReactView } from "react-adobe-embed";
import "./App.css";
const baseUrl = process.env.REACT_APP_API_URL;
const envBoolean = baseUrl.includes("localhost");
const clientId = envBoolean
  ? "c1ec9fc28533449db43c043fbe978014"
  : "1e680a2462f046418ad046eb11b2bfe8";

export default function App() {
  //switch between environment

  console.log(envBoolean);
  console.log(clientId);

  return (
    <div className="pdfViewer">
      <ReactViewAdobe
        previewConfig={{
          showZoomControl: false,
          showAnnotationTools: true,
          includePDFAnnotations: true,
          showDownloadPDF: false,
          showPrintPDF: true,
          enableFormFilling: false,
          showLeftHandPanel: false,
          enableLinearization: false,
          showFullScreen: true,
          showDownloadPDF: false,
          showBookmarks: false,
          embedMode: "SIZED_CONTAINER",
          defaultViewMode: "FIT_PAGE",
        }}
        config={{
          /**
         * Feel free to use this api key, it only works for http://localhost 
          so I don't care if you use it. It won't work for http://localhost:3000, 
          it needs to be http://localhost:80 or https://localhost:443.
          */
          // clientId: "1e680a2462f046418ad046eb11b2bfe8", //jqzzz.com
          // clientId: "c1ec9fc28533449db43c043fbe978014", //localhost
          clientId: { clientId },
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
