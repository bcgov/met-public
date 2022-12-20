import React, { useEffect } from 'react';
import { EditorState, ContentState, convertFromHTML, convertFromRaw, convertToRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import { FormControl, FormHelperText } from '@mui/material';
import { MetPaper } from '../../common';
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
    initialPlainText = '',
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

    useEffect(() => {
        const blocksFromHTML = convertFromHTML(initialPlainText);
        const contentState = ContentState.createFromBlockArray(blocksFromHTML.contentBlocks, blocksFromHTML.entityMap);
        setEditorState(EditorState.createWithContent(contentState));
    });

    return (
        <FormControl fullWidth>
            <MetPaper style={{ borderColor: `${error ? '#d32f2f' : '#606060'}` }}>
                <form>
                    <Editor
                        spellCheck
                        editorState={editorState}
                        onEditorStateChange={handleChange}
                        handlePastedText={() => false}
                        editorStyle={{
                            height: '10em',
                            padding: '1em',
                            resize: 'vertical',
                        }}
                        toolbar={{
                            options: [
                                'inline',
                                'blockType',
                                'fontSize',
                                'list',
                                'colorPicker',
                                'link',
                                'embedded',
                                'emoji',
                                'image',
                                'history',
                            ],
                            inline: {
                                options: ['bold', 'italic', 'underline', 'superscript', 'subscript'],
                            },
                            list: { options: ['unordered', 'ordered'] },
                        }}
                    />
                </form>
            </MetPaper>
            <FormHelperText error={error}>{error ? helperText : ''}</FormHelperText>
        </FormControl>
    );
};

export default RichTextEditor;
