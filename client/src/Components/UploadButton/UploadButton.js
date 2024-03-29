import React, { useEffect, useState } from "react";
import "./style.css";
import $ from "jquery";

const UploadButton = ({ props }) => {
  // send file info to parent
  const sentFileExtToParent = props;

  useEffect(() => {
    var btnUpload = $("#upload_file"),
      btnOuter = $(".button_outer");
    btnUpload.on("change", function (e) {
      var ext = btnUpload.val().split(".").pop().toLowerCase();
      // send file info to parent
      sentFileExtToParent(ext);
      // send file info to parent

      if ($.inArray(ext, ["gif", "png", "jpg", "jpeg"]) == -1) {
        $(".error_msg").text("Profile's format needs to be gif/png/jpg/jpeg");
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
    <main className="main_full">
      <div className="container">
        <div className="panel">
          <div className="button_outer">
            <div className="btn_upload">
              <input type="file" id="upload_file" name="" />
              Upload New Profile
            </div>
            <div className="processing_bar"></div>
            <div className="success_box"></div>
          </div>
        </div>
        <div className="error_msg"></div>
        <div className="uploaded_file_view" id="uploaded_view">
          <span className="file_remove">X</span>
        </div>
      </div>
    </main>
  );
};

export default UploadButton;
