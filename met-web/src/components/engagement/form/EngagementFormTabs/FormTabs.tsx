import React from 'react';
import Box from '@mui/material/Box';
import TabContext from '@mui/lab/TabContext';
import EngagementForm from './EngagementForm';
import { MetTab, MetTabList, MetTabPanel } from '../StyledTabComponents';
import { EngagementFormTabValues, ENGAGEMENT_FORM_TABS } from './constants';
import EngagementUserManagement from './EngagementUserManagement';
import EngagementLinks from './Links';
import EngagementSettings from './Settings';

const FormTabs = () => {
    const [value, setValue] = React.useState<EngagementFormTabValues>(ENGAGEMENT_FORM_TABS.DETAILS);

    return (
        <Box sx={{ width: '100%', typography: 'body1' }}>
            <TabContext value={value}>
                <Box>
                    <MetTabList
                        onChange={(_event: React.SyntheticEvent, newValue: EngagementFormTabValues) =>
                            setValue(newValue)
                        }
                        TabIndicatorProps={{
                            style: { transition: 'none', display: 'none' },
                        }}
                        variant="scrollable"
                    >
                        <MetTab label="Engagement Details" value={ENGAGEMENT_FORM_TABS.DETAILS} />
                        <MetTab label="User Management" value={ENGAGEMENT_FORM_TABS.USER_MANAGEMENT} />
                        <MetTab label="Settings" value={ENGAGEMENT_FORM_TABS.SETTINGS} />
                        <MetTab label="URL (links)" value={ENGAGEMENT_FORM_TABS.LINKS} />
                    </MetTabList>
                </Box>
                <MetTabPanel value={ENGAGEMENT_FORM_TABS.DETAILS}>
                    <EngagementForm />
                </MetTabPanel>
                <MetTabPanel value={ENGAGEMENT_FORM_TABS.USER_MANAGEMENT}>
                    <EngagementUserManagement />
                </MetTabPanel>
                <MetTabPanel value={ENGAGEMENT_FORM_TABS.SETTINGS}>
                    <EngagementSettings />
                </MetTabPanel>
                <MetTabPanel value={ENGAGEMENT_FORM_TABS.LINKS}>
                    <EngagementLinks />
                </MetTabPanel>
            </TabContext>
        </Box>
    );
};

export default FormTabs;
