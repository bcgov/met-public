import React, { Suspense, useState, useEffect } from 'react';
import { Tab, Skeleton, Box, useMediaQuery, Theme } from '@mui/material';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { Await, useLoaderData } from 'react-router-dom';
import { getEditorStateFromRaw } from 'components/common/RichTextEditor/utils';
import { Header2 } from 'components/common/Typography';
import { colors } from 'components/common';
import { RichTextArea } from 'components/common/Input/RichTextArea';
import { EngagementLoaderData } from './EngagementLoader';
import { EngagementViewSections } from '.';
import { FormDetailsTab } from 'engagements/admin/create/authoring/types';

// Todo: Replace this placeholder widget boolean type with a real widget type
interface FormDetailsTabWithWidget extends FormDetailsTab {
    widget: boolean;
}

export const EngagementDetailsTabs = () => {
    const { details } = useLoaderData() as EngagementLoaderData;
    const [detailsTabs, setDetailsTabs] = useState<FormDetailsTabWithWidget[]>([]);
    const [selectedTab, setSelectedTab] = useState('0');
    const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));

    useEffect(() => {
        details.then((tabs) => {
            const parsedTabs: FormDetailsTabWithWidget[] = tabs.map((t) => ({
                id: t.id || -1,
                engagement_id: t.engagement_id || 0,
                label: t.label || '',
                slug: t.slug || '',
                heading: t.heading || '',
                body: getEditorStateFromRaw(JSON.stringify(t.body) || ''),
                sort_index: t.sort_index || -1,
                widget: true, // Todo: Replace with real widget value
            }));
            const sortedTabs = [...parsedTabs].sort((a, b) => a.sort_index - b.sort_index);
            setDetailsTabs(sortedTabs);
        });
    }, [details]);

    // STYLES

    const containerStyles = {
        padding: { xs: '0 16px 24px 16px', md: '0 5vw 40px 5vw', lg: '0 156px 40px 156px' },
        boxSizing: 'border-box',
        marginTop: 0,
        position: 'relative',
        zIndex: 10,
    };

    const tabListStyles = {
        mb: isMobile ? 0 : '1rem',
        width: '100%',
        '& .MuiTabs-scroller': {
            width: isMobile ? '100%' : 'max-content',
            pb: isMobile ? 0 : '1rem',

            '.MuiTabs-indicator': {
                display: 'flex',
                justifyContent: 'center',
                height: '6px',
                backgroundColor: colors.surface.blue[90],
                width: '4px',
                color: colors.surface.blue[90],
            },
        },
        '& .MuiTabs-flexContainer': {
            justifyContent: 'flex-start',
            width: isMobile ? '100%' : 'max-content',
            flexDirection: isMobile ? 'column' : 'row',
        },
    };

    const tabStyles = {
        width: isMobile ? '100%' : 'max-content',
        maxWidth: '100%',
        color: colors.type.regular.primary,
        background: isMobile ? colors.surface.gray[20] : 'transparent',
        minWidth: '3rem',
        fontSize: '14px',
        fontWeight: 'normal',
        mr: isMobile ? 0 : '2rem',
        padding: isMobile ? '0.75rem' : '1.25rem 0',
        mt: '0.75rem',
        '&:first-of-type': {
            mt: isMobile ? '1rem' : '0.75rem',
        },
        alignItems: isMobile ? 'flex-start' : 'center',
        '&.Mui-selected': {
            fontWeight: 'bold',
            background: isMobile ? colors.surface.blue['20'] : 'transparent',
        },
    };

    const tabIndicatorStyles = { marginBottom: '16px' };

    const tabLayoutStyles = {
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        width: '100%',
        gap: '3rem',
    };

    const textContainerStyles = {
        display: 'flex',
        alignItems: 'flex-start',
        flexDirection: 'column',
    };

    const widgetContainerStyles = {
        display: 'flex',
        flexBasis: isMobile ? '100%' : '30%',
        mt: isMobile ? 0 : '1rem',
        alignItems: 'center',
        justifyContent: 'center',
        border: '2px dashed gray',
        borderRadius: '1rem',
        minHeight: '15rem',
    };

    return (
        <section id={EngagementViewSections.DETAILS_TABS} aria-label="Engagement details tabs">
            <Box sx={containerStyles}>
                <TabContext value={selectedTab}>
                    <Suspense fallback={<Skeleton variant="rectangular" sx={{ width: '300px', height: '81px' }} />}>
                        <Await resolve={details}>
                            <>
                                <TabList
                                    onChange={(_, value) => setSelectedTab(value)}
                                    orientation={isMobile ? 'vertical' : 'horizontal'}
                                    variant={isMobile ? 'scrollable' : 'standard'}
                                    scrollButtons={false}
                                    TabIndicatorProps={{ sx: tabIndicatorStyles }}
                                    sx={tabListStyles}
                                >
                                    {detailsTabs.map((tab, key) => (
                                        <Tab
                                            sx={tabStyles}
                                            key={tab.id}
                                            label={tab.label}
                                            aria-label={tab.label}
                                            value={key.toString()}
                                            disableRipple
                                        />
                                    ))}
                                </TabList>
                                {detailsTabs.map((tab, key) => (
                                    <TabPanel key={tab.id} value={key.toString()} sx={{ padding: '1.5rem 0' }}>
                                        <Box sx={tabLayoutStyles}>
                                            <Box
                                                sx={{
                                                    ...textContainerStyles,
                                                    // Restrict width of text if using desktop viewport and a widget is present
                                                    flexBasis: tab.widget && !isMobile ? '70%' : '100%',
                                                }}
                                            >
                                                <Header2 decorated weight="thin" aria-label={tab.heading}>
                                                    {tab.heading}
                                                </Header2>
                                                <RichTextArea
                                                    maxLines={isMobile ? 15 : 9} // Lines are short on mobile, show a few more.
                                                    editorState={tab.body}
                                                    readOnly={true}
                                                    toolbarHidden
                                                />
                                            </Box>
                                            {/* Todo: Implement real widgets */}
                                            {tab.widget && (
                                                <Box sx={widgetContainerStyles}>
                                                    <p>Widget will go here</p>
                                                </Box>
                                            )}
                                        </Box>
                                    </TabPanel>
                                ))}
                            </>
                        </Await>
                    </Suspense>
                </TabContext>
            </Box>
        </section>
    );
};
