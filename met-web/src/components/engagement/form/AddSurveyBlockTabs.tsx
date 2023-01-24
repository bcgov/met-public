import React, { useState } from 'react';
import Box from '@mui/material/Box';
import TabContext from '@mui/lab/TabContext';
import { MetTab, MetTabList, MetTabPanel } from './StyledTabComponents';
import { SubmissionStatusTypes, SUBMISSION_STATUS } from 'constants/engagementStatus';
import { SurveyUpcomingTextInput } from './SurveyUpcomingTextInput';
import { SurveyOpenTextInput } from './SurveyOpenTextInput';
import { SurveyClosedTextInput } from './SurveyClosedTextInput';

const AddSurveyBlockTabs = () => {
    // set initial value to upcoming
    const [value, setValue] = useState<SubmissionStatusTypes>(SUBMISSION_STATUS.UPCOMING);

    return (
        <Box sx={{ width: '100%', typography: 'body1' }}>
            <TabContext value={value}>
                <Box sx={{ marginBottom: '0.25em' }}>
                    <MetTabList
                        onChange={(_event: React.SyntheticEvent, newValue: SubmissionStatusTypes) => {
                            setValue(newValue);
                        }}
                        TabIndicatorProps={{
                            style: { transition: 'none', display: 'none' },
                        }}
                    >
                        <MetTab label="Upcoming" value={SUBMISSION_STATUS.UPCOMING} />
                        <MetTab label="Open" value={SUBMISSION_STATUS.OPEN} />
                        <MetTab label="Closed" value={SUBMISSION_STATUS.CLOSED} />
                    </MetTabList>
                </Box>
                <MetTabPanel value={SUBMISSION_STATUS.UPCOMING}>
                    <SurveyUpcomingTextInput />
                </MetTabPanel>
                <MetTabPanel value={SUBMISSION_STATUS.OPEN}>
                    <SurveyOpenTextInput />
                </MetTabPanel>
                <MetTabPanel value={SUBMISSION_STATUS.CLOSED}>
                    <SurveyClosedTextInput />
                </MetTabPanel>
            </TabContext>
        </Box>
    );
};
export default AddSurveyBlockTabs;
