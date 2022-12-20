import React from 'react';
import Box from '@mui/material/Box';
import TabContext from '@mui/lab/TabContext';
import RichTextEditor from './RichTextEditor';
import { MetTab, MetTabList, MetTabPanel } from './StyledTabComponents';
import { upcomingText, openText, closedText } from 'constants/submissionStatusText';

const AddSurveyBlockTabs = () => {
    const [value, setValue] = React.useState('upcoming');

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
                        <MetTab label="Upcoming" value="upcoming" />
                        <MetTab label="Open" value="open" />
                        <MetTab label="Closed" value="closed" />
                    </MetTabList>
                </Box>
                <MetTabPanel value="upcoming">
                    <RichTextEditor initialHTMLText={upcomingText} />
                </MetTabPanel>
                <MetTabPanel value="open">
                    <RichTextEditor initialHTMLText={openText} />
                </MetTabPanel>
                <MetTabPanel value="closed">
                    <RichTextEditor initialHTMLText={closedText} />
                </MetTabPanel>
            </TabContext>
        </Box>
    );
};

export default AddSurveyBlockTabs;
