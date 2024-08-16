import React, { Suspense, useState } from 'react';
import { useRouteLoaderData, Await } from 'react-router-dom';
import { Engagement } from 'models/engagement';
import { AutoBreadcrumbs } from 'components/common/Navigation/Breadcrumb';
import { EngagementStatus } from 'constants/engagementStatus';
import { Tab } from '@mui/material';
import { ResponsiveContainer } from 'components/common/Layout';
import { ConfigSummary } from './ConfigSummary';
import { AuthoringTab } from './AuthoringTab';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { EngagementLoaderData } from 'components/engagement/public/view';

export const AdminEngagementView = () => {
    const { engagement, teamMembers, slug } = useRouteLoaderData('single-engagement') as EngagementLoaderData;

    const EngagementViewTabs = {
        config: 'Configuration',
        author: 'Authoring',
        activity: 'Activity',
        results: 'Results',
        publish: 'Publishing',
    };

    const [currentTab, setCurrentTab] = useState(EngagementViewTabs.config);

    return (
        <ResponsiveContainer>
            <AutoBreadcrumbs />
            <Suspense>
                <Await resolve={engagement}>
                    {(engagement: Engagement) => (
                        <div style={{ marginTop: '2rem' }}>
                            <span
                                style={{
                                    background: '#CE3E39',
                                    padding: '0.2rem 0.75rem',
                                    color: 'white',
                                    borderRadius: '3px',
                                    fontSize: '0.8rem',
                                }}
                            >
                                {EngagementStatus[engagement?.status_id]}
                            </span>
                            <h1 style={{ marginTop: '0.5rem' }}>{engagement?.name}</h1>
                        </div>
                    )}
                </Await>
            </Suspense>
            <TabContext value={currentTab}>
                <TabList
                    component="nav"
                    variant="scrollable"
                    onChange={(e, newValue) => setCurrentTab(newValue)}
                    aria-label="Admin Engagement View Tabs"
                    TabIndicatorProps={{ sx: { display: 'none' } }}
                    sx={{
                        '& .MuiTabs-flexContainer': {
                            justifyContent: 'flex-start',
                            width: 'max-content',
                        },
                    }}
                >
                    {Object.entries(EngagementViewTabs).map(([key, value]) => (
                        <Tab
                            key={key}
                            value={value}
                            label={value}
                            disableFocusRipple
                            sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                height: '48px',
                                padding: '4px 24px 2px 18px',
                                fontSize: '14px',
                                borderRadius: '0px 16px 0px 0px',
                                borderBottom: '2px solid',
                                borderBottomColor: 'gray.60',
                                boxShadow:
                                    '0px 1px 5px 0px rgba(0, 0, 0, 0.12), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 3px 1px -2px rgba(0, 0, 0, 0.20)',
                                backgroundColor: 'gray.10',
                                color: 'text.secondary',
                                fontWeight: 'normal',
                                '&.Mui-selected': {
                                    backgroundColor: 'primary.main',
                                    borderColor: 'primary.main',
                                    color: 'white',
                                    fontWeight: 'bold',
                                },
                                outlineOffset: '-4px',
                                '&:focus-visible': {
                                    outline: `2px solid`,
                                    outlineColor: 'focus.inner',
                                    border: '4px solid',
                                    borderColor: 'focus.outer',
                                    padding: '0px 20px 0px 14px',
                                },
                            }}
                        />
                    ))}
                </TabList>
                <Suspense>
                    <TabPanel value={EngagementViewTabs.config}>
                        <Await resolve={Promise.all([engagement, teamMembers, slug])}>
                            <ConfigSummary />
                        </Await>
                    </TabPanel>
                </Suspense>
                <TabPanel value={EngagementViewTabs.author} style={{ paddingLeft: '0', paddingRight: '0' }}>
                    <Await resolve={engagement}>
                        <AuthoringTab />
                    </Await>
                </TabPanel>
            </TabContext>
        </ResponsiveContainer>
    );
};
