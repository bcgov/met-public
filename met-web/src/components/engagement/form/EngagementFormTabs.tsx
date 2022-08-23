import React from 'react';
import Box from '@mui/material/Box';
import TabContext from '@mui/lab/TabContext';
import EngagementForm from './EngagementForm';
import EngagementSettings from './EngagementSettings';
import { EngagementFormTab, EngagementFormTabList, EngagementFormTabPanel } from './StyledTabComponents';

const EngagementFormTabs = () => {
    const [value, setValue] = React.useState('details');

    return (
        <Box sx={{ width: '100%', typography: 'body1' }}>
            <TabContext value={value}>
                <Box sx={{ marginBottom: '0.25em' }}>
                    <EngagementFormTabList
                        onChange={(_event: React.SyntheticEvent, newValue: string) => setValue(newValue)}
                        TabIndicatorProps={{
                            style: { transition: 'none', display: 'none' },
                        }}
                    >
                        <EngagementFormTab label="Engagement Details" value="details" />
                        <EngagementFormTab label="Settings" value="settings" />
                    </EngagementFormTabList>
                </Box>
                <EngagementFormTabPanel value="details">
                    <EngagementForm />
                </EngagementFormTabPanel>
                <EngagementFormTabPanel value="settings">
                    <EngagementSettings />
                </EngagementFormTabPanel>
            </TabContext>
        </Box>
    );
};

export default EngagementFormTabs;
