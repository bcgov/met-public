import React, { useContext } from 'react';
import { MetPaper } from '../../common';
import { EditorState, convertFromRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import { ActionContext } from './ActionContext';
import './EngagementContent.scss';
import { Skeleton } from '@mui/material';

export const EngagementContent = () => {
    const { savedEngagement, isEngagementLoading } = useContext(ActionContext);

    const { rich_content } = savedEngagement;

    const getEditorState = (rawTextToConvert: string) => {
        if (!rawTextToConvert) {
            return EditorState.createEmpty();
        }
        const rawContentFromStore = convertFromRaw(JSON.parse(rawTextToConvert));
        return EditorState.createWithContent(rawContentFromStore);
    };

    if (isEngagementLoading) {
        return <Skeleton variant="rectangular" width="100%" height="30em" />;
    }

    return (
        <MetPaper elevation={1} sx={{ padding: '2em', minHeight: '30em' }}>
            <Editor
                editorState={getEditorState(rich_content)}
                readOnly={true}
                onChange={() => {
                    //do nothing because this is read only
                }}
                toolbarClassName="hide-toolbar"
            />
        </MetPaper>
    );
};
