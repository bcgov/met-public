import React, { useContext } from 'react';
import { MetPaper } from '../../common';
import { Editor } from 'react-draft-wysiwyg';
import { ActionContext } from './ActionContext';
import { Skeleton } from '@mui/material';
import { getEditorStateFromRaw } from 'components/common/RichTextEditor/utils';

export const EngagementContent = ({ index = 0 }: { index?: number }) => {
    const { content, isEngagementLoading } = useContext(ActionContext);

    if (isEngagementLoading || !content.length) {
        return <Skeleton variant="rectangular" width="100%" height="30em" />;
    }

    return (
        <MetPaper elevation={1} sx={{ padding: '2em', pt: '0px', minHeight: '30em' }}>
            <Editor editorState={getEditorStateFromRaw(content[index].json_content)} readOnly={true} toolbarHidden />
        </MetPaper>
    );
};
