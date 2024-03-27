import { EditorState } from "prosemirror-state";
import { EditorView } from "prosemirror-view";
import { Schema, DOMParser } from "prosemirror-model";
import { schema } from "prosemirror-schema-basic";
import { addListNodes } from "prosemirror-schema-list";
import { exampleSetup } from "prosemirror-example-setup";
import { useEffect, useRef } from "react";
import { undo, redo, history } from "prosemirror-history";
import { keymap } from "prosemirror-keymap";
import { newlineInCode, Command } from "prosemirror-commands";

const mySchema = new Schema({
  nodes: addListNodes(schema.spec.nodes, "paragraph block*", "block"),
  marks: schema.spec.marks,
});

const doc = DOMParser.fromSchema(mySchema).parse(document.createElement("div"));

const plugins = exampleSetup({ schema: mySchema });
console.log("plugins", plugins);

const newLineCommand = (state, dispatch) => {
  dispatch(state.tr.insertText("\n"));
  return true;
};

export function Editor() {
  const editorRef = useRef(null);
  const editorDom = useRef(null);

  useEffect(() => {
    if (editorRef.current) return;
    editorRef.current = new EditorView(editorDom.current, {
      state: EditorState.create({
        doc,
        plugins: [
          history(),
          keymap({
            "Mod-b": undo,
            "Mod-a": redo,
            "Shift-Enter": newLineCommand,
          }),
        ],
      }),
    });
  }, []);

  return <div id="editor" ref={editorDom} />;
}
