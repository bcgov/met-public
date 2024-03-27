import React, { useEffect, useState, useContext } from 'react';
import { Grid } from '@mui/material';
import { SurveyBlock } from '../SurveyBlock';
import { MetDescription, MetLabel } from 'components/common';
import RichTextEditor from 'components/common/RichTextEditor';
import { EngagementTabsContext } from '../EngagementTabsContext';
import { ActionContext } from '../../ActionContext';

const SummaryTabContent = () => {
    const { savedEngagement } = useContext(ActionContext);
    const [initialRichContent, setInitialRichContent] = useState('');
    const [editorDisabled, setEditorDisabled] = useState(false);

    const { engagementFormData, setEngagementFormData, richContent, setRichContent } =
        useContext(EngagementTabsContext);

    const handleContentChange = (rawText: string) => {
        setEngagementFormData({
            ...engagementFormData,
            content: rawText,
        });
    };

    const handleRichContentChange = (newState: string) => {
        setRichContent(newState);
    };

    useEffect(() => {
        setInitialRichContent(richContent || savedEngagement.rich_content);
        setEditorDisabled(false);
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
                <MetLabel>Engagement - Page Content</MetLabel>

                <MetDescription>This is the main content of the engagement page.</MetDescription>

                <div style={{ position: 'relative' }}>
                    <RichTextEditor
                        setRawText={handleContentChange}
                        handleEditorStateChange={handleRichContentChange}
                        initialRawEditorState={initialRichContent || ''}
                    />
                    {/* Overlay to prevent user interaction */}
                    {editorDisabled && (
                        <div
                            style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%',
                                backgroundColor: 'transparent',
                                zIndex: 999,
                            }}
                        />
                    )}
                </div>
            </Grid>
            <Grid item xs={12}>
                <SurveyBlock />
            </Grid>
        </Grid>
    );
};

export default SummaryTabContent;
