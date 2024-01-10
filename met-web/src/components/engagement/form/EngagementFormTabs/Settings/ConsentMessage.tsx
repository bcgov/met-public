import React, { useContext, useState } from 'react';
import { Box, Grid, Typography } from '@mui/material';
import { MetHeader4, MetDescription } from 'components/common';
import { EngagementSettingsContext } from './EngagementSettingsContext';
import RichTextEditor from 'components/common/RichTextEditor';

const ConsentMessage = () => {
    const [descriptionCharCount, setDescriptionCharCount] = useState(0);
    const { consentMessage, setConsentMessage } = useContext(EngagementSettingsContext);

    const handleContentChange = (rawText: string) => {
        setDescriptionCharCount(rawText.length);
    };

    const handleRichContentChange = (newState: string) => {
        setConsentMessage(newState);
    };

    return (
        <Grid container direction="row" justifyContent="flex-start" alignItems="flex-start" spacing={1}>
            <Grid item xs={12} mt={1}>
                <MetHeader4 bold>Collection Notice/Consent Message</MetHeader4>
            </Grid>
            <Grid item xs={12}>
                <Box display="flex" flexDirection="column" justifyContent="space-between">
                    <RichTextEditor
                        setRawText={handleContentChange}
                        handleEditorStateChange={handleRichContentChange}
                        initialRawEditorState={consentMessage || ''}
                    />
                    <Typography alignSelf="flex-end">Character Count: {descriptionCharCount}</Typography>
                </Box>
            </Grid>
        </Grid>
    );
};

export default ConsentMessage;
