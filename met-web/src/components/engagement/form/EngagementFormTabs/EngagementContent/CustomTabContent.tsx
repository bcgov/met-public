import React, { useEffect, useState, useContext } from 'react';
import { Grid } from '@mui/material';
import { MetDescription, MetLabel } from 'components/common';
import RichTextEditor from 'components/common/RichTextEditor';
import { EngagementTabsContext } from '../EngagementTabsContext';

const CustomTabContent = () => {
    const [initialRichContent, setInitialRichContent] = useState('');

    const { setCustomTextContent, customJsonContent, setCustomJsonContent } = useContext(EngagementTabsContext);

    const handleContentChange = (rawText: string) => {
        setCustomTextContent(rawText);
    };

    const handleRichContentChange = (newState: string) => {
        setCustomJsonContent(newState);
    };

    useEffect(() => {
        setInitialRichContent(customJsonContent);
    }, []);

    return (
        <Grid
            item
            xs={12}
            container
            direction="row"
            justifyContent="flex-start"
            alignItems="baseline"
            rowSpacing={{ xs: 1, sm: 0 }}
            columnSpacing={2}
        >
            <Grid item xs={12}>
                <MetLabel>Engagement - Page Custom Content</MetLabel>

                <MetDescription>This is the additional content of the engagement page.</MetDescription>

                <RichTextEditor
                    setRawText={handleContentChange}
                    handleEditorStateChange={handleRichContentChange}
                    initialRawEditorState={initialRichContent || ''}
                />
            </Grid>
        </Grid>
    );
};

export default CustomTabContent;
