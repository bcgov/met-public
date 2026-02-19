import React, { Suspense } from 'react';
import { useRouteLoaderData, Await, useMatches, UIMatch, Outlet } from 'react-router';
import { Engagement } from 'models/engagement';
import { EngagementStatus } from 'constants/engagementStatus';
import { Box, Skeleton, Tab } from '@mui/material';
import { ResponsiveContainer } from 'components/common/Layout';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { EngagementLoaderData } from 'components/engagement/public/view';
import { RouterLinkRenderer } from 'components/common/Navigation/Link';
import { Header1 } from 'components/common/Typography';
import { StatusLabel } from '../create/authoring/AuthoringTemplate';
// Prevents page load fail due to waiting for engagement title on refresh
const AutoBreadcrumbs = React.lazy(() =>
    import('components/common/Navigation/Breadcrumb').then((m) => ({ default: m.AutoBreadcrumbs })),
);

const AdminEngagementView = () => {
    const { engagement } = useRouteLoaderData('single-engagement') as EngagementLoaderData;

    const EngagementViewTabs = {
        config: 'Configuration',
        authoring: 'Authoring',
        activity: 'Activity',
        results: 'Results',
        publish: 'Publishing',
    };

    const matches = useMatches() as UIMatch[];
    const currentTab = matches[matches.length - 1].pathname.split('/').pop() ?? '';

    return (
        <ResponsiveContainer>
            <AutoBreadcrumbs />
            <Box mt={4}>
                <Suspense fallback={<StatusLabel completed={false} text="Loading..." />}>
                    <Await resolve={engagement}>
                        {(engagement: Engagement) => (
                            <StatusLabel completed={false} text={EngagementStatus[engagement?.status_id]} />
                        )}
                    </Await>
                </Suspense>
                <Suspense
                    fallback={
                        <Skeleton variant="text">
                            <Header1 mt={1} mb={3}>
                                Loading...
                            </Header1>
                        </Skeleton>
                    }
                >
                    <Header1 mt={1} mb={3}>
                        <Await resolve={engagement}>{(engagement: Engagement) => engagement?.name}</Await>
                    </Header1>
                </Suspense>
            </Box>
            <TabContext value={currentTab}>
                <TabList
                    component="nav"
                    variant="scrollable"
                    aria-label="Admin Engagement View Tabs"
                    TabIndicatorProps={{ sx: { display: 'none' } }}
                    sx={{
                        '& .MuiTabs-flexContainer': {
                            justifyContent: 'flex-start',
                            borderBottom: '2px solid',
                            borderBottomColor: 'gray.60',
                            width: 'calc(100% - 7.75rem)',
                            minWidth: 'max-content',
                        },
                    }}
                >
                    {Object.entries(EngagementViewTabs).map(([key, value]) => (
                        <Tab
                            key={key}
                            value={key}
                            label={value}
                            disableFocusRipple
                            LinkComponent={RouterLinkRenderer}
                            href={`${key}`}
                            sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                height: '48px',
                                padding: '4px 24px 2px 18px',
                                fontSize: '14px',
                                borderRadius: '0px 16px 0px 0px',
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
                <TabPanel value={currentTab} sx={{ padding: '2rem 0' }}>
                    <Outlet />
                </TabPanel>
            </TabContext>
        </ResponsiveContainer>
    );
};

export default AdminEngagementView;
