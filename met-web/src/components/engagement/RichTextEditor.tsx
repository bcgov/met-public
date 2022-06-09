import React, { useEffect } from 'react';
import { EditorState, convertFromRaw, convertToRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import { FormControl, FormHelperText } from '@mui/material';
import { MetPaper } from '../common';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import './RichEditorStyles.css';

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
            <MetPaper style={{ borderColor: `${error ? '#d32f2f' : '#606060'}` }}>
                <form>
                    <Editor
                        spellCheck
                        editorState={editorState}
                        onEditorStateChange={handleChange}
                        editorStyle={{
                            height: '10em',
                            margin: '1em',
                        }}
                    />
                </form>
            </MetPaper>
            <FormHelperText error={error}>{error ? helperText : ' '}</FormHelperText>
        </FormControl>
    );
};

export default RichTextEditor;
