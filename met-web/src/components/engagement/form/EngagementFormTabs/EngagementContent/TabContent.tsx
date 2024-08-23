import React, { useEffect, useState, useContext } from 'react';
import { Grid } from '@mui/material';
import { SurveyBlock } from '../SurveyBlock';
import RichTextEditor from 'components/common/RichTextEditor';
import { EngagementTabsContext } from '../EngagementTabsContext';
import { ActionContext } from '../../ActionContext';
import { BodyText } from 'components/common/Typography';
import { Unless, When } from 'react-if';

const TabContent = ({ index }: { index: number }) => {
    const { savedEngagement, contentTabs, setContentTabs } = useContext(ActionContext);
    const [initialRichContent, setInitialRichContent] = useState('');
    const [editorDisabled, setEditorDisabled] = useState(false);

    const { richContent, setRichContent } = useContext(EngagementTabsContext);

    const handleContentChange = (rawText: string) => {
        setContentTabs((prevTabs) => {
            const newTabs = [...prevTabs];
            newTabs[index].json_content = rawText;
            return newTabs;
        });
    };

    const handleRichContentChange = (newState: string) => {
        setRichContent(newState);
    };

    useEffect(() => {
        setInitialRichContent(richContent || savedEngagement.rich_content);
        setEditorDisabled(false);
    }, [savedEngagement, richContent]);

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
                <When condition={index === 0}>
                    <BodyText bold size="large">
                        Engagement - Page Content
                    </BodyText>
                    <BodyText size="small">This is the main content of the engagement page.</BodyText>
                </When>
                <Unless condition={index === 0}>
                    <BodyText bold size="large">
                        Additional Tab {index} - {contentTabs[index].title}
                    </BodyText>
                    <BodyText size="small">Additional content for the engagement page.</BodyText>
                </Unless>

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
            <When condition={index === 0}>
                <Grid item xs={12}>
                    <SurveyBlock />
                </Grid>
            </When>
        </Grid>
    );
};

export default TabContent;
