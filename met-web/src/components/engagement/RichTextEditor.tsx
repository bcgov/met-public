import React, { useContext } from "react";
import { EditorState, convertFromRaw, convertToRaw } from "draft-js";
import createToolbarPlugin from "@draft-js-plugins/static-toolbar";
import "draft-js/dist/Draft.css";
import "@draft-js-plugins/static-toolbar/lib/plugin.css";
import "./RichTextEditor.css";
import Editor from "@draft-js-plugins/editor";
import { ActionContext } from "./ActionContext";
import { FormControl, FormHelperText } from "@mui/material";
import { MetBox } from "../common";

const toolbarPlugin = createToolbarPlugin();
const { Toolbar } = toolbarPlugin;

// let timer = null;
const RichTextEditor = ({
  setRawText = (rawText: string) => {},
  error = false,
  helperText = "Field cannot be empty",
}: any) => {
  const cntxt = useContext(ActionContext);

  console.log(cntxt.handleEditorStateChange);

  const getEditorState = (rawTextToConvert: string) => {
    return EditorState.createEmpty();
    const rawContentFromStore = convertFromRaw(JSON.parse("/{}/"));
    return EditorState.createWithContent(rawContentFromStore);
  };

  const [editorState, setEditorState] = React.useState(
    !cntxt.rawEditorState
      ? EditorState.createEmpty()
      : getEditorState(cntxt.rawEditorState)
  );

  const handleChange = (newEditorState: EditorState) => {
    const plainText = newEditorState.getCurrentContent().getPlainText();

    setEditorState(newEditorState);
    const _editorstateinJSON = JSON.stringify(
      convertToRaw(newEditorState.getCurrentContent())
    );
    // setRawEditorState(_editorstateinJSON);
    setRawText(plainText);
  };

  return (
    <FormControl fullWidth>
      <MetBox style={{ borderColor: `${error && "#d32f2f"}` }}>
        <form>
          <Toolbar />
          <Editor
            editorState={editorState}
            onChange={handleChange}
            plugins={[toolbarPlugin]}
          />
        </form>
      </MetBox>
      <FormHelperText error={error}>{error && helperText}</FormHelperText>
    </FormControl>
  );
};

export default RichTextEditor;
