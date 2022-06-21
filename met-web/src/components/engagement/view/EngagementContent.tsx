import React, { useContext } from 'react';
import { MetPaper, MetPageGridContainer } from '../../common';
import { Editor, EditorState, convertFromRaw } from 'draft-js';
import { ActionContext } from './ActionContext';
import { Grid } from '@mui/material';

export const EngagementContent = () => {
    const { savedEngagement } = useContext(ActionContext);

    const { rich_content } = savedEngagement;

    const getEditorState = (rawTextToConvert: string) => {
        if (!rawTextToConvert) {
            return EditorState.createEmpty();
        }
        const rawContentFromStore = convertFromRaw(JSON.parse(rawTextToConvert));
        return EditorState.createWithContent(rawContentFromStore);
    };

    return (
        <MetPageGridContainer
            container
            direction="row"
            justifyContent={'flex-start'}
            alignItems="flex-start"
            spacing={2}
        >
            <Grid item xs={8}>
                <MetPaper elevation={1} sx={{ padding: '2em', minHeight: '30em' }}>
                    <Editor
                        editorState={getEditorState(rich_content)}
                        readOnly={true}
                        onChange={() => {
                            //do nothing because this is read only
                        }}
                    />
                </MetPaper>
            </Grid>
        </MetPageGridContainer>
    );
};
