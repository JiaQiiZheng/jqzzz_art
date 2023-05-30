import React, { useEffect } from "react";
import "./style.css";
import * as $ from "jquery";

const UploadButton = () => {
  useEffect(() => {
    var btnUpload = $("#upload_file"),
      btnOuter = $(".button_outer");
    btnUpload.on("change", function (e) {
      var ext = btnUpload.val().split(".").pop().toLowerCase();
      if ($.inArray(ext, ["gif", "png", "jpg", "jpeg"]) == -1) {
        $(".error_msg").text("Not an Image...");
      } else {
        $(".error_msg").text("");
        btnOuter.addClass("file_uploading");
        setTimeout(function () {
          btnOuter.addClass("file_uploaded");
        }, 3000);
        var uploadedFile = URL.createObjectURL(e.target.files[0]);
        setTimeout(function () {
          $("#uploaded_view")
            .append('<img src="' + uploadedFile + '" />')
            .addClass("show");
        }, 3500);
      }
    });
    $(".file_remove").on("click", function (e) {
      $("#uploaded_view").removeClass("show");
      $("#uploaded_view").find("img").remove();
      btnOuter.removeClass("file_uploading");
      btnOuter.removeClass("file_uploaded");
    });
  }, []);
  return (
    <main class="main_full">
      <div class="container">
        <div class="panel">
          <div class="button_outer">
            <div class="btn_upload">
              <input type="file" id="upload_file" name="" />
              Upload New Profile
            </div>
            <div class="processing_bar"></div>
            <div class="success_box"></div>
          </div>
        </div>
        <div class="error_msg"></div>
        <div class="uploaded_file_view" id="uploaded_view">
          <span class="file_remove">X</span>
        </div>
      </div>
    </main>
  );
};

export default UploadButton;
