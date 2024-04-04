import React, { useContext, useEffect, useState } from 'react';
import { Box, Grid } from '@mui/material';
import { MetHeader4 } from 'components/common';
import { EngagementTabsContext } from '../EngagementTabsContext';
import RichTextEditor from 'components/common/RichTextEditor';
import { ActionContext } from '../../ActionContext';

const ConsentMessage = () => {
    const { savedEngagement } = useContext(ActionContext);
    const { engagementFormData, setEngagementFormData, richConsentMessage, setRichConsentMessage } =
        useContext(EngagementTabsContext);
    const [initialRichConsentMessage, setInitialRichConsentMessage] = useState('');

    const handleRichContentChange = (newState: string) => {
        setRichConsentMessage(newState);
        setEngagementFormData({
            ...engagementFormData,
            consent_message: newState,
        });
    };

    useEffect(() => {
        setInitialRichConsentMessage(richConsentMessage || savedEngagement.consent_message);
    }, []);

    return (
        <Grid container direction="row" justifyContent="flex-start" alignItems="flex-start" spacing={1} mt={1}>
            <Grid item xs={12} mt={1}>
                <MetHeader4 bold>Collection Notice/Consent Message</MetHeader4>
            </Grid>
            <Grid item xs={12}>
                <Box display="flex" flexDirection="column" justifyContent="space-between">
                    <RichTextEditor
                        handleEditorStateChange={handleRichContentChange}
                        initialRawEditorState={initialRichConsentMessage || ''}
                    />
                </Box>
            </Grid>
        </Grid>
    );
};

export default ConsentMessage;
