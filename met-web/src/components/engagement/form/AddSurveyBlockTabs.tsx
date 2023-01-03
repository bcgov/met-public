import React, { useContext, useEffect } from 'react';
import Box from '@mui/material/Box';
import TabContext from '@mui/lab/TabContext';
import RichTextEditor from './RichTextEditor';
import { MetTab, MetTabList, MetTabPanel } from './StyledTabComponents';
import { upcomingText, openText, closedText } from 'constants/submissionStatusText';
import { SubmissionStatus } from 'constants/engagementStatus';
import { EngagementStatusBlock } from '../../../models/engagementStatusBlock';
import { ActionContext } from './ActionContext';

const AddSurveyBlockTabs = ({
    handleChange = (statusBlock: EngagementStatusBlock[]) => {
        /* empty default method  */
    },
}) => {
    // set initial value to upcoming
    const [value, setValue] = React.useState(SubmissionStatus[SubmissionStatus.Upcoming]);

    // get saved engagement details
    const { savedEngagement } = useContext(ActionContext);
    const { status_block } = savedEngagement;
    const [savedUpcomingText, setSavedUpcomingText] = React.useState('');
    const [savedOpenText, setSavedOpenText] = React.useState('');
    const [savedClosedText, setSavedClosedText] = React.useState('');
    const getsavedRichText = () => {
        status_block.map((item) => {
            if (item.survey_status === SubmissionStatus[SubmissionStatus.Upcoming]) {
                setSavedUpcomingText(item.block_text);
            }
            if (item.survey_status === SubmissionStatus[SubmissionStatus.Open]) {
                setSavedOpenText(item.block_text);
            }
            if (item.survey_status === SubmissionStatus[SubmissionStatus.Closed]) {
                setSavedClosedText(item.block_text);
            }
        });

        return;
    };
    useEffect(() => {
        getsavedRichText();
    }, [savedEngagement]);

    // array to pass updated content to engagement context
    const surveyBlockContent = [
        { survey_status: SubmissionStatus[SubmissionStatus.Upcoming], block_text: '' },
        { survey_status: SubmissionStatus[SubmissionStatus.Open], block_text: '' },
        { survey_status: SubmissionStatus[SubmissionStatus.Closed], block_text: '' },
    ];

    // capture changes in richdescription
    const handleStatusBlockContentChange = (newState: string) => {
        surveyBlockContent.forEach((item) => {
            if (item.survey_status === value && newState) {
                item.block_text = newState;
            }
            return item;
        });
        handleChange(surveyBlockContent);
    };

    return (
        <Box sx={{ width: '100%', typography: 'body1' }}>
            <TabContext value={value}>
                <Box sx={{ marginBottom: '0.25em' }}>
                    <MetTabList
                        onChange={(_event: React.SyntheticEvent, newValue: string) => setValue(newValue)}
                        TabIndicatorProps={{
                            style: { transition: 'none', display: 'none' },
                        }}
                    >
                        <MetTab label="Upcoming" value={SubmissionStatus[SubmissionStatus.Upcoming]} />
                        <MetTab label="Open" value={SubmissionStatus[SubmissionStatus.Open]} />
                        <MetTab label="Closed" value={SubmissionStatus[SubmissionStatus.Closed]} />
                    </MetTabList>
                </Box>
                <MetTabPanel value={SubmissionStatus[SubmissionStatus.Upcoming]}>
                    <RichTextEditor
                        handleEditorStateChange={handleStatusBlockContentChange}
                        initialHTMLText={upcomingText}
                        initialRawEditorState={savedUpcomingText}
                    />
                </MetTabPanel>
                <MetTabPanel value={SubmissionStatus[SubmissionStatus.Open]}>
                    <RichTextEditor
                        handleEditorStateChange={handleStatusBlockContentChange}
                        initialHTMLText={openText}
                        initialRawEditorState={savedOpenText}
                    />
                </MetTabPanel>
                <MetTabPanel value={SubmissionStatus[SubmissionStatus.Closed]}>
                    <RichTextEditor
                        handleEditorStateChange={handleStatusBlockContentChange}
                        initialHTMLText={closedText}
                        initialRawEditorState={savedClosedText}
                    />
                </MetTabPanel>
            </TabContext>
        </Box>
    );
};

export default AddSurveyBlockTabs;
