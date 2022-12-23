import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import TabContext from '@mui/lab/TabContext';
import RichTextEditor from './RichTextEditor';
import { MetTab, MetTabList, MetTabPanel } from './StyledTabComponents';
import { upcomingText, openText, closedText } from 'constants/submissionStatusText';
import { SubmissionStatus } from 'constants/engagementStatus';
import { EngagementStatusBlock } from '../../../models/engagementStatusBlock';

const AddSurveyBlockTabs = ({
    handleChange = (statusBlock: EngagementStatusBlock[]) => {
        /* empty default method  */
    },
}) => {
    // set initial value to upcoming
    const [value, setValue] = React.useState(SubmissionStatus[SubmissionStatus.Upcoming]);

    // array to pass updated content to engagement context
    const surveyBlockContent = [
        { survey_status: SubmissionStatus[SubmissionStatus.Upcoming], block_text: '' },
        { survey_status: SubmissionStatus[SubmissionStatus.Open], block_text: '' },
        { survey_status: SubmissionStatus[SubmissionStatus.Closed], block_text: '' },
    ];
    const [contentList, setcontentList] = useState(surveyBlockContent);

    // capture changes in richdescription
    const handleRichDescriptionChange = (newState: string) => {
        const updatedSurveyBlockContent = contentList.map((item) => {
            if (item.survey_status === value && newState) {
                item.block_text = newState;
            }
            return item;
        });
        setcontentList(updatedSurveyBlockContent);
    };

    // exclude content having empty block text
    useEffect(() => {
        const filterContentList = contentList.filter(function (el) {
            return el.block_text != '';
        });
        handleChange(filterContentList);
    }, [contentList]);

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
                        handleEditorStateChange={handleRichDescriptionChange}
                        initialHTMLText={upcomingText}
                    />
                </MetTabPanel>
                <MetTabPanel value={SubmissionStatus[SubmissionStatus.Open]}>
                    <RichTextEditor handleEditorStateChange={handleRichDescriptionChange} initialHTMLText={openText} />
                </MetTabPanel>
                <MetTabPanel value={SubmissionStatus[SubmissionStatus.Closed]}>
                    <RichTextEditor
                        handleEditorStateChange={handleRichDescriptionChange}
                        initialHTMLText={closedText}
                    />
                </MetTabPanel>
            </TabContext>
        </Box>
    );
};

export default AddSurveyBlockTabs;
