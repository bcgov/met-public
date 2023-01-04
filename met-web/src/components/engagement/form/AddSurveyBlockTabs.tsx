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
    const [changedUpcomingText, setChangedUpcomingText] = React.useState('');
    const [changedOpenText, setChangedOpenText] = React.useState('');
    const [changedClosedText, setChangedClosedText] = React.useState('');
    const [savedClosedText, setSavedClosedText] = React.useState('');
    const getsavedRichText = () => {
        status_block.forEach((item) => {
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
        {
            survey_status: SubmissionStatus[SubmissionStatus.Upcoming],
            block_text: changedUpcomingText ? changedUpcomingText : '',
        },
        {
            survey_status: SubmissionStatus[SubmissionStatus.Open],
            block_text: changedOpenText ? changedOpenText : '',
        },
        {
            survey_status: SubmissionStatus[SubmissionStatus.Closed],
            block_text: changedClosedText ? changedClosedText : '',
        },
    ];

    // capture changes in richdescription
    const handleStatusBlockContentChange = (newState: string) => {
        surveyBlockContent.forEach((item) => {
            if (item.survey_status === value && newState) {
                item.block_text = newState;
            }
            return item;
        });
        if (value === SubmissionStatus[SubmissionStatus.Upcoming]) {
            setChangedUpcomingText(newState);
        }
        if (value === SubmissionStatus[SubmissionStatus.Open]) {
            setChangedOpenText(newState);
        }
        if (value === SubmissionStatus[SubmissionStatus.Closed]) {
            setChangedClosedText(newState);
        }
        handleChange(surveyBlockContent);
    };

    // retain the state on tab changes
    const handleKeepStateOnTabChanges = () => {
        setSavedUpcomingText(changedUpcomingText ? changedUpcomingText : savedUpcomingText);
        setSavedOpenText(changedOpenText ? changedOpenText : savedOpenText);
        setSavedClosedText(changedClosedText ? changedClosedText : savedClosedText);
    };

    return (
        <Box sx={{ width: '100%', typography: 'body1' }}>
            <TabContext value={value}>
                <Box sx={{ marginBottom: '0.25em' }}>
                    <MetTabList
                        onChange={(_event: React.SyntheticEvent, newValue: string) => {
                            setValue(newValue);
                            handleKeepStateOnTabChanges();
                        }}
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
