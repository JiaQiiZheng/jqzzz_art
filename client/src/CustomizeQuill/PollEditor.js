import React, { Component } from "react";
import Quill from "quill";
import defer from "lodash/defer";
import map from "lodash/map";

export default class Editor extends Component {
  constructor(props) {
    super(props);
    this.editor = null;
    this.editorContainer = React.createRef();
    this.state = {
      embedBlots: [],
    };
  }

  componentDidMount() {
    this.editor = new Quill(this.editorContainer.current, {
      placeholder: "Start typing",
      readOnly: false,
      formats: ["header", "poll"],
    });

    let blots = [];
    /** Listener to listen for custom format */
    this.editor.scroll.emitter.on("blot-mount", (blot) => {
      blots.push(blot);
      defer(() => {
        if (blots.length > 0) {
          this.onMount(...blots);
          blots = [];
        }
      });
    });
    this.editor.scroll.emitter.on("blot-unmount", this.onUnmount);

    const delta = {
      ops: [
        /** Bold Formatting */
        {
          insert: "Header 1",
        },
        {
          insert: "\n",
          attributes: {
            header: 1,
          },
        },
      ],
    };
    this.editor.setContents(delta);
  }

  onMount = (...blots) => {
    const embeds = blots.reduce(
      (memo, blot) => {
        memo[blot.id] = blot;
        return memo;
      },
      { ...this.state.embedBlots }
    );
    this.setState({ embedBlots: embeds });
  };

  onUnmount = (unmountedBlot) => {
    const { [unmountedBlot.id]: blot, ...embedBlots } = this.state.embedBlots;
    this.setState({ embedBlots });
  };

  renderPoll() {
    const range = this.editor.getSelection(true);
    const type = "poll";
    const data = {};
    /** Call pollFormat */
    this.editor.insertEmbed(range.index, type, data);
    console.log(this.editor.getContents());
  }

  render() {
    return (
      <>
        <div spellCheck={false} ref={this.editorContainer}>
          {map(this.state.embedBlots, (blot) => blot.renderPortal(blot.id))}
        </div>
        <button onClick={() => this.renderPoll()}>Poll</button>
      </>
    );
  }
}
