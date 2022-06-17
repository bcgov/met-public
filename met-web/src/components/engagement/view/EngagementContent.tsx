import React, { useContext } from 'react';
import { MetPaper } from '../../common';
import { Editor, EditorState, convertFromRaw } from 'draft-js';
import { ActionContext } from './ActionContext';
import { Grid } from '@mui/material';
import { MetPageGridContainer } from '../../common';

export const EngagementContent = () => {
    const { savedEngagement } = useContext(ActionContext);

    const { rich_description } = savedEngagement;

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
                        editorState={getEditorState(rich_description)}
                        readOnly={true}
                        onChange={() => {
                            //do nothing
                        }}
                    />
                </MetPaper>
            </Grid>
        </MetPageGridContainer>
    );
};
