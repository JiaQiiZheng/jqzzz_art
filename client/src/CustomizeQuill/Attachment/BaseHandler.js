import { Attachment } from "../../assets/ui/UI_library";
import GetIconSvg from "../../assets/ui/FileIcon/GetIconSvg";

class BaseHandler {
  constructor(quill, options) {
    this.quill = quill;
    this.options = options;
    this.range = null;

    // let node = document.createElement("div");
    // node.innerHTML = `<div id="progress">-------progess bar-------</div>`;
    // this.quill.container.appendChild(node);
  }
  appendAttachmentIcon() {
    const _elements = document.getElementsByClassName("ql-attachment");
    if (_elements.length > 0) {
      let node = document.createElement("div");
      node.innerHTML = Attachment();
      const _element = _elements[0];
      if (!_element) return;
      if (_element?.children.length <= 0) _elements[0].appendChild(node);
    }
  }

  applyForToolbar() {
    var toolbar = this.quill.getModule("toolbar");
    this.appendAttachmentIcon();
    if (toolbar) {
      toolbar.addHandler(this.handler, this.selectLocalFile.bind(this));
    }
  }

  selectLocalFile() {
    const _accpepted =
      this.handler === "attachment" ? "*" : `${this.handler}/*`;
    this.range = this.quill.getSelection();
    this.fileHolder = document.createElement("input");
    this.fileHolder.setAttribute("type", "file");
    this.fileHolder.setAttribute("accept", _accpepted);
    this.fileHolder.onchange = this.fileChanged.bind(this);
    this.fileHolder.click();
  }

  loadFile(context) {
    const file = context.fileHolder.files[0];
    this.handlerId = Helper.generateID();

    const fileReader = new FileReader();
    fileReader.addEventListener(
      "load",
      () => {
        const ext = file.name.split(".").pop();
        this.insertBase64Data(fileReader.result, this.handlerId);
      },
      false
    );

    if (!file) {
      console.warn("[File not found] Something was wrong, please try again!!");
      return;
    }
    fileReader.readAsDataURL(file);
    return file;
  }
  embedFile(file) {
    this.options.upload(file).then(
      (url) => {
        this.insertFileToEditor(url);
      },
      (error) => {
        console.warn(error.message);
      }
    );
  }
  insertBase64Data(url, id) {
    const range = this.range;
    id = this.handlerId;
    this.quill.insertEmbed(
      range.index,
      this.handler,
      `${id}ID_SPLIT_FLAG${url}ID_SPLIT_FLAG`
    );
    this.quill.setSelection(range.index + 1);
  }
  insertFileToEditor(url) {
    console.log(url);
    const el = document.getElementById(this.handlerId);
  }
}

const Helper = {
  id: 0,
  prefix: "AttachmentHandler",
  generateID: function () {
    // const id = Date.now();
    const id = this.id;
    this.id = id + 1;
    return `${this.prefix}-${id}`;
  },

  blotHTML: (href, svg) => {
    return `<a href="${href}" target="_blank" download><i>${svg}</i></a>`;
  },
};

export default BaseHandler;
