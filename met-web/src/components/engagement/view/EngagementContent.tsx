import React, { useContext } from 'react';
import { MetPaper } from '../../common';
import { Editor } from 'react-draft-wysiwyg';
import { ActionContext } from './ActionContext';
import { Skeleton } from '@mui/material';
import { getEditorState } from 'utils';

export const EngagementContent = () => {
    const { savedEngagement, isEngagementLoading } = useContext(ActionContext);

    const { rich_content } = savedEngagement;

    if (isEngagementLoading) {
        return <Skeleton variant="rectangular" width="100%" height="30em" />;
    }

    return (
        <MetPaper elevation={1} sx={{ padding: '2em', minHeight: '30em' }}>
            <Editor editorState={getEditorState(rich_content)} readOnly={true} toolbarHidden />
        </MetPaper>
    );
};
