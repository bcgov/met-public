import React, { useContext } from 'react';
import Box from '@mui/material/Box';
import TabContext from '@mui/lab/TabContext';
import EngagementForm from './EngagementForm';
import { MetTab, MetTabList, MetTabPanel } from '../StyledTabComponents';
import { EngagementFormTabValues, ENGAGEMENT_FORM_TABS } from './constants';
import EngagementUserManagement from './UserManagement/EngagementUserManagement';
import EngagementSettingsForm from './Settings/EngagementSettingsForm';
import EngagementResults from './Results/EngagementResults';
import { ActionContext } from '../ActionContext';
import { MetTooltip } from 'components/common';
import AdditionalTabContent from './AdditionalDetails/AdditionalTabContent';

const FormTabs = () => {
    const [value, setValue] = React.useState<EngagementFormTabValues>(ENGAGEMENT_FORM_TABS.CONTENT);
    const { savedEngagement } = useContext(ActionContext);

    const generateTab = (label: string, value: string, icon = null) => {
        return (
            <MetTab
                style={{ pointerEvents: 'auto' }}
                disabled={!savedEngagement.id}
                value={value}
                icon={
                    !savedEngagement.id ? (
                        <MetTooltip title={'Engagement needs to be saved first'}>
                            {icon ? icon : <span>{label}</span>}
                        </MetTooltip>
                    ) : (
                        <span>{icon ? icon : label}</span>
                    )
                }
            />
        );
    };

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
                        <MetTab label="Engagement Content" value={ENGAGEMENT_FORM_TABS.CONTENT} />
                        {generateTab('Additional Details', ENGAGEMENT_FORM_TABS.ADDITIONAL)}
                        {generateTab('User Management', ENGAGEMENT_FORM_TABS.USER_MANAGEMENT)}
                        {generateTab('Settings', ENGAGEMENT_FORM_TABS.SETTINGS)}
                        {generateTab('Results', ENGAGEMENT_FORM_TABS.RESULTS)}
                    </MetTabList>
                </Box>
                <MetTabPanel value={ENGAGEMENT_FORM_TABS.CONTENT}>
                    <EngagementForm />
                </MetTabPanel>
                <MetTabPanel value={ENGAGEMENT_FORM_TABS.ADDITIONAL}>
                    <AdditionalTabContent />
                </MetTabPanel>
                <MetTabPanel value={ENGAGEMENT_FORM_TABS.USER_MANAGEMENT}>
                    <EngagementUserManagement />
                </MetTabPanel>
                <MetTabPanel value={ENGAGEMENT_FORM_TABS.SETTINGS}>
                    <EngagementSettingsForm />
                </MetTabPanel>
                <MetTabPanel value={ENGAGEMENT_FORM_TABS.RESULTS}>
                    <EngagementResults />
                </MetTabPanel>
            </TabContext>
        </Box>
    );
};

export default FormTabs;
