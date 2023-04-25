import { Quill } from "react-quill";

class Counter {
  constructor(quill, options) {
    this.quill = quill;
    this.container = quill.addContainer("ql-counter");
    this.renderCounter();
    quill.on(Quill.events.TEXT_CHANGE, this.renderCounter);
  }
  renderCounter = () => {
    var text = this.quill.getText();
    // const char = text.replace(/\s/g, "");
    text = text.trim();
    const word = text.length > 0 ? text.split(/\s+/).length : 0;
    this.container.innerHTML = "";
    this.container.innerHTML = `word counts：${word}`;
  };
}

export default Counter;
