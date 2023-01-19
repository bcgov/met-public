import React from 'react';
import Box from '@mui/material/Box';
import TabContext from '@mui/lab/TabContext';
import EngagementForm from '../EngagementForm';
import EngagementSettings from '../EngagementSettings';
import { MetTab, MetTabList, MetTabPanel } from '../StyledTabComponents';

const EngagementFormTabs = () => {
    const [value, setValue] = React.useState('details');

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
                        <MetTab label="Engagement Details" value="details" />
                        <MetTab label="Settings" value="settings" />
                    </MetTabList>
                </Box>
                <MetTabPanel value="details">
                    <EngagementForm />
                </MetTabPanel>
                <MetTabPanel value="settings">
                    <EngagementSettings />
                </MetTabPanel>
            </TabContext>
        </Box>
    );
};

export default EngagementFormTabs;
