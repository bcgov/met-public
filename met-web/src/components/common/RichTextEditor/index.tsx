import React, { useEffect } from 'react';
import { EditorState, convertToRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import { FormControl, FormHelperText } from '@mui/material';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import './RichEditorStyles.css';
import { getEditorStateFromHtml, getEditorStateFromRaw } from './utils';
import { MetPaper } from '..';

const RichTextEditor = ({
    setRawText = (_rawText: string) => {
        /* empty default method  */
    },
    handleEditorStateChange = (_stringifiedEditorState: string) => {
        /* empty default method  */
    },
    initialRawEditorState = '',
    initialHTMLText = '',
    error = false,
    helperText = '',
}) => {
    const getStateFromInitialValue = () => {
        if (initialRawEditorState) {
            setEditorState(getEditorStateFromRaw(initialRawEditorState));
            return;
        }

        if (initialHTMLText) {
            const contentState = getEditorStateFromHtml(initialHTMLText);
            setEditorState(contentState);
        }
    };

    const [editorState, setEditorState] = React.useState(getEditorStateFromRaw(initialRawEditorState));

    const handleChange = (newEditorState: EditorState) => {
        const plainText = newEditorState.getCurrentContent().getPlainText();
        setEditorState(newEditorState);
        const stringifiedEditorState = JSON.stringify(convertToRaw(newEditorState.getCurrentContent()));
        handleEditorStateChange(stringifiedEditorState);
        setRawText(plainText);
    };

    useEffect(() => {
        getStateFromInitialValue();
    }, [initialRawEditorState, initialHTMLText]);

    return (
        <FormControl fullWidth>
            <MetPaper style={{ borderColor: `${error ? '#d32f2f' : ''}` }}>
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
