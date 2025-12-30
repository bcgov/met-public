import React, { useEffect, useState } from 'react';
import { Tab, Box, useMediaQuery, Theme } from '@mui/material';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { useLoaderData } from 'react-router-dom';
import { getEditorStateFromRaw } from 'components/common/RichTextEditor/utils';
import { Header2 } from 'components/common/Typography';
import { colors } from 'components/common';
import { RichTextArea } from 'components/common/Input/RichTextArea';
import { EngagementLoaderData, EngagementViewSections } from '.';
import { FormDetailsTab } from 'engagements/admin/create/authoring/types';
import { EngagementDetailsTab } from 'models/engagementDetailsTab';

// Todo: Replace this placeholder widget boolean type with a real widget type
interface FormDetailsTabWithWidget extends FormDetailsTab {
    widget: boolean;
}

const parseAndSortTabs = (tabs: EngagementDetailsTab[]): FormDetailsTabWithWidget[] => {
    const parsedTabs: FormDetailsTabWithWidget[] = tabs.map((t) => ({
        id: Number(t.id) || -1,
        engagement_id: t.engagement_id || 0,
        label: t.label || '',
        slug: t.slug || '',
        heading: t.heading || '',
        body: getEditorStateFromRaw(JSON.stringify(t.body) || ''),
        sort_index: t.sort_index || -1,
        widget: true, // Todo: Replace with real widget value
    }));
    return [...parsedTabs].sort((a, b) => a.sort_index - b.sort_index);
};

export const EngagementDetailsTabs = () => {
    const { details } = useLoaderData() as EngagementLoaderData; // Get fresh data to avoid DB sync issues
    const [selectedTab, setSelectedTab] = useState('0');
    const [tabs, setTabs] = useState<FormDetailsTabWithWidget[]>([]);
    const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'), { noSsr: true });

    useEffect(() => {
        details.then((d) => {
            setTabs(parseAndSortTabs(d));
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
        mb: { xs: 0, md: '1rem' },
        width: '100%',
        '& .MuiTabs-scroller': {
            width: { xs: '100%', md: 'max-content' },
            pb: { xs: 0, md: '1rem' },
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
            width: { xs: '100%', md: 'max-content' },
            flexDirection: { xs: 'column', md: 'row' },
        },
    };

    const tabStyles = {
        width: { xs: '100%', md: 'max-content' },
        maxWidth: '100%',
        color: colors.type.regular.primary,
        background: { xs: colors.surface.gray[20], md: 'transparent' },
        minWidth: '3rem',
        fontSize: '14px',
        fontWeight: 'normal',
        mr: { xs: 0, md: '2rem' },
        padding: { xs: '0.75rem', md: '1.25rem 0' },
        mt: '0.75rem',
        '&:first-of-type': {
            mt: { xs: '1rem', md: '0.75rem' },
        },
        alignItems: { xs: 'flex-start', md: 'center' },
        '&.Mui-selected': {
            fontWeight: 'bold',
            background: { xs: colors.surface.blue['20'], md: 'transparent' },
        },
    };

    const tabIndicatorStyles = { marginBottom: '16px' };

    const tabLayoutStyles = {
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
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
        flexBasis: { xs: '100%', md: '30%' },
        mt: { xs: 0, md: '1rem' },
        alignItems: 'center',
        justifyContent: 'center',
        border: '2px dashed gray',
        borderRadius: '1rem',
        minHeight: '15rem',
    };

    return (
        <section id={EngagementViewSections.DETAILS_TABS} aria-label="Engagement details tabs">
            <Box sx={{ ...containerStyles, minHeight: '500px' }}>
                <TabContext value={selectedTab}>
                    {tabs.length > 0 && (
                        <>
                            <TabList
                                onChange={(_, value) => setSelectedTab(value)}
                                orientation={isMobile ? 'vertical' : 'horizontal'}
                                variant={isMobile ? 'scrollable' : 'standard'}
                                scrollButtons={false}
                                TabIndicatorProps={{ sx: tabIndicatorStyles }}
                                sx={tabListStyles}
                            >
                                {tabs.map((tab, key) => (
                                    <Tab
                                        sx={tabStyles}
                                        key={tab.id}
                                        label={tab.label}
                                        aria-label={tab.label}
                                        value={String(key)}
                                        disableRipple
                                    />
                                ))}
                            </TabList>
                            {tabs.map((tab, key) => (
                                <TabPanel key={tab.id} value={String(key)} sx={{ padding: '1.5rem 0' }}>
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
                    )}
                </TabContext>
            </Box>
        </section>
    );
};
