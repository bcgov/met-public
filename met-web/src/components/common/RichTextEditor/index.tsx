import React, { useEffect } from 'react';
import { EditorState, convertToRaw } from 'draft-js';
import { RichTextArea as Editor } from '../Input/RichTextArea';
import { FormControl, FormHelperText } from '@mui/material';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import './RichEditorStyles.css';
import { getEditorStateFromHtml, getEditorStateFromRaw } from './utils';
import { MetPaper } from '..';

/**
 * A Rich Text Editor component that uses react-draft-wysiwyg to render a rich text editor.
 * It allows for rich text editing with various toolbar options.
 * @param {Object} props - The properties for the RichTextEditor component.
 * @param {Function} props.setRawText - Function to set the raw text content of the editor.
 * @param {Function} props.handleEditorStateChange - Function to handle changes in the editor state.
 * @param {string} props.initialRawEditorState - Initial raw editor state in JSON format.
 * @param {string} props.initialHTMLText - Initial HTML text to populate the editor.
 * @param {boolean} props.error - Boolean indicating if there is an error in the editor.
 * @param {string} props.helperText - Text to display as helper text below the editor, typically used for error messages.
 * @param {Object} props.toolbar - Configuration for the editor toolbar, allowing customization of available options.
 *                  Options include 'inline', 'list', 'link', 'blockType', and 'history'.
 *                  Each option can have sub-options, such as 'bold', 'italic', 'underline', etc.
 * @see {@link https://jpuri.github.io/react-draft-wysiwyg/#/docs} for more details on the editor and its options.
 * @see {@link https://draftjs.org/docs/advanced-topics-decorators} for more information on decorators in Draft.js.
 * @returns
 */

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
    toolbar = {
        options: ['inline', 'list', 'link', 'blockType', 'history'],
        inline: {
            options: ['bold', 'italic', 'underline', 'superscript', 'subscript'],
        },
        blockType: { options: ['Normal', 'H2', 'H3', 'Blockquote'] },
        list: { options: ['unordered', 'ordered'] },
    },
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

        if (!initialRawEditorState && !initialHTMLText) {
            setEditorState(getEditorStateFromRaw(''));
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
                            padding: '1em',
                            resize: 'vertical',
                        }}
                        toolbar={toolbar}
                    />
                </form>
            </MetPaper>
            <FormHelperText error={error}>{error ? helperText : ''}</FormHelperText>
        </FormControl>
    );
};

export default RichTextEditor;
