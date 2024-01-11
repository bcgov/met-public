import React, { useContext } from 'react';
import { Box, Grid } from '@mui/material';
import { MetHeader4 } from 'components/common';
import { AdditionalDetailsContext } from './AdditionalDetailsContext';
import RichTextEditor from 'components/common/RichTextEditor';

const ConsentMessage = () => {
    const { initialConsentMessage, setConsentMessage } = useContext(AdditionalDetailsContext);

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
                        handleEditorStateChange={handleRichContentChange}
                        initialRawEditorState={initialConsentMessage || ''}
                    />
                </Box>
            </Grid>
        </Grid>
    );
};

export default ConsentMessage;
