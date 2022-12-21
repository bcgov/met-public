import React from 'react';
import Box from '@mui/material/Box';
import TabContext from '@mui/lab/TabContext';
import RichTextEditor from './RichTextEditor';
import { MetTab, MetTabList, MetTabPanel } from './StyledTabComponents';
import { upcomingText, openText, closedText } from 'constants/submissionStatusText';
import { SubmissionStatus } from 'constants/engagementStatus';

const AddSurveyBlockTabs = () => {
    const [value, setValue] = React.useState(SubmissionStatus[SubmissionStatus.Upcoming]);

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
                    <RichTextEditor initialHTMLText={upcomingText} />
                </MetTabPanel>
                <MetTabPanel value={SubmissionStatus[SubmissionStatus.Open]}>
                    <RichTextEditor initialHTMLText={openText} />
                </MetTabPanel>
                <MetTabPanel value={SubmissionStatus[SubmissionStatus.Closed]}>
                    <RichTextEditor initialHTMLText={closedText} />
                </MetTabPanel>
            </TabContext>
        </Box>
    );
};

export default AddSurveyBlockTabs;
