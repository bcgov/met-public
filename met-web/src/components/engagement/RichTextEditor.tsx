import React, { useEffect } from 'react';
import { EditorState, convertFromRaw, convertToRaw } from 'draft-js';
import createToolbarPlugin from '@draft-js-plugins/static-toolbar';
import 'draft-js/dist/Draft.css';
import '@draft-js-plugins/static-toolbar/lib/plugin.css';
import './RichTextEditor.css';
import Editor from '@draft-js-plugins/editor';
import { FormControl, FormHelperText } from '@mui/material';
import { MetBox } from '../common';

const toolbarPlugin = createToolbarPlugin();
const { Toolbar } = toolbarPlugin;

const RichTextEditor = ({
    setRawText = (_rawText: string) => {
        /* empty default method  */
    },
    handleEditorStateChange = (_stringifiedEditorState: string) => {
        /* empty default method  */
    },
    initialRawEditorState = '',
    error = false,
    helperText = 'Field cannot be empty',
}) => {
    const getEditorState = (rawTextToConvert: string) => {
        if (!rawTextToConvert) {
            return EditorState.createEmpty();
        }
        const rawContentFromStore = convertFromRaw(JSON.parse(rawTextToConvert));
        return EditorState.createWithContent(rawContentFromStore);
    };

    const [editorState, setEditorState] = React.useState(getEditorState(initialRawEditorState));

    const handleChange = (newEditorState: EditorState) => {
        const plainText = newEditorState.getCurrentContent().getPlainText();

        setEditorState(newEditorState);
        const stringifiedEditorState = JSON.stringify(convertToRaw(newEditorState.getCurrentContent()));
        handleEditorStateChange(stringifiedEditorState);
        setRawText(plainText);
    };

    useEffect(() => {
        setEditorState(getEditorState(initialRawEditorState));
    }, [initialRawEditorState]);

    return (
        <FormControl fullWidth>
            <MetBox style={{ borderColor: `${error ? '#d32f2f' : '#606060'}` }}>
                <form>
                    <Toolbar />
                    <Editor editorState={editorState} onChange={handleChange} plugins={[toolbarPlugin]} />
                </form>
            </MetBox>
            <FormHelperText error={error}>{error ? helperText : ' '}</FormHelperText>
        </FormControl>
    );
};

export default RichTextEditor;
