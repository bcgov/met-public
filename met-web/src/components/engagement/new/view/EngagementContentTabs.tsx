import React, { Suspense, SyntheticEvent, useCallback, useState } from 'react';
import { Tab, Skeleton, Box } from '@mui/material';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { Await, useLoaderData } from 'react-router-dom';
import { EngagementContent } from 'models/engagementContent';
import { EngagementSummaryContent } from 'models/engagementSummaryContent';
import { getEditorStateFromRaw } from 'components/common/RichTextEditor/utils';
import { Header2 } from 'components/common/Typography';
import { colors } from 'components/common';
import { RichTextArea } from 'components/common/Input/RichTextArea';

export const EngagementContentTabs = () => {
    const { content, contentSummary } = useLoaderData() as {
        content: Promise<EngagementContent>;
        contentSummary: Promise<EngagementSummaryContent[]>;
    };
    const [selectedTab, setSelectedTab] = useState('0');
    const handleChange = (event: SyntheticEvent<Element, Event>, newValue: string) => {
        setSelectedTab(newValue);
    };

    const panelContents = Promise.all([content, contentSummary]);

    const tabListRef = useCallback((node: HTMLButtonElement) => {
        if (!node) return;
        const scroller = node.getElementsByClassName('MuiTabs-scroller')[0];
        scroller.addEventListener('scroll', () => checkFade(node)); // check when scrolling
        const resizeObserver = new ResizeObserver(() => checkFade(node));
        resizeObserver.observe(scroller); // check when window resizes
        checkFade(node); // initial check when attaching the ref
    }, []);

    const checkFade = (node: HTMLButtonElement) => {
        if (!node) return;
        const scroller = node.getElementsByClassName('MuiTabs-scroller')[0];
        const scrollPosition = scroller.scrollLeft; // distance from left edge
        const maxScroll = scroller.scrollWidth - scroller.clientWidth; // distance from right edge
        const fadeMargin = 64; // pixels
        if (maxScroll - scrollPosition < fadeMargin) {
            node.classList.remove('fade-right');
        } else {
            node.classList.add('fade-right');
        }
    };

    return (
        <section id="content-tabs" aria-label="Engagement content tabs">
            <Box
                sx={{
                    padding: { xs: '0 16px 24px 16px', md: '0 5vw 40px 5vw', lg: '0 156px 40px 156px' },
                    marginTop: '-32px',
                    position: 'relative',
                    zIndex: 10,
                }}
            >
                <TabContext value={selectedTab}>
                    <Box sx={{}}>
                        <Suspense fallback={<Skeleton variant="rectangular" sx={{ width: '300px', height: '81px' }} />}>
                            <Await resolve={content}>
                                {(resolvedContent: EngagementContent[]) => (
                                    <TabList
                                        ref={tabListRef}
                                        onChange={handleChange}
                                        variant="scrollable"
                                        scrollButtons={false}
                                        TabIndicatorProps={{
                                            sx: { marginBottom: '16px' },
                                        }}
                                        sx={{
                                            width: {
                                                xs: 'calc(100% + 16px)',
                                                md: 'calc(100% + 5vw)',
                                                lg: 'calc(100% + 156px)',
                                            },
                                            '&.fade-right::after': {
                                                // fade out the right edge of the tab list
                                                content: '""',
                                                display: 'block',
                                                position: 'absolute',
                                                top: 0,
                                                right: 0,
                                                width: '48px',
                                                height: '100%',
                                                background:
                                                    'linear-gradient(to left, rgba(255,255,255,1) 0%, rgba(255,255,255,0.8) 5%, rgba(255,255,255,0.8) 50%, rgba(255,255,255,0) 100%)',
                                                pointerEvents: 'none', //allow clicking on faded tabs
                                            },
                                            '& .MuiTabs-indicator': {
                                                display: 'flex',
                                                justifyContent: 'center',
                                                height: '6px',
                                                backgroundColor: colors.surface.blue[90],
                                            },
                                            '& .MuiTabs-scroller': {
                                                width: 'max-content',
                                                paddingBottom: '16px',
                                            },
                                            '& .MuiTabs-flexContainer': {
                                                justifyContent: 'flex-start',
                                                width: 'max-content',
                                            },
                                        }}
                                    >
                                        <Box sx={{ width: '16px', background: 'white' }}></Box>
                                        {resolvedContent.map((section, index) => {
                                            return (
                                                <Tab
                                                    sx={{
                                                        background: 'white',
                                                        color: colors.type.regular.primary,
                                                        fontSize: '14px',
                                                        fontWeight: 'normal',
                                                        padding: '24px 8px',
                                                        paddingLeft: '8px',
                                                        '&.Mui-selected': {
                                                            fontWeight: 'bold',
                                                            color: colors.surface.blue[90],
                                                        },
                                                    }}
                                                    key={section.id}
                                                    label={section.title}
                                                    value={index.toString()}
                                                />
                                            );
                                        })}
                                        <Box
                                            sx={{
                                                background: 'white',
                                                width: '24px',
                                                borderRadius: '0px 24px 0px 0px',
                                                marginRight: { xs: '16px', md: '5vw', lg: '156px' },
                                            }}
                                        ></Box>
                                    </TabList>
                                )}
                            </Await>
                        </Suspense>
                    </Box>
                    <Suspense fallback={<Skeleton variant="rectangular" sx={{ width: '100%', height: '174px' }} />}>
                        <Await resolve={panelContents}>
                            {([content, contentSummary]: [
                                content: EngagementContent[],
                                contentSummary: EngagementSummaryContent[],
                            ]) => {
                                return contentSummary.map((summary, index) => (
                                    <TabPanel key={summary.id} value={index.toString()} sx={{ padding: '24px 0px' }}>
                                        <Header2 decorated weight="thin">
                                            {content[index].title}
                                        </Header2>
                                        <RichTextArea
                                            key={summary.id}
                                            editorState={getEditorStateFromRaw(summary.rich_content)}
                                            readOnly={true}
                                            toolbarHidden
                                        />
                                    </TabPanel>
                                ));
                            }}
                        </Await>
                    </Suspense>
                </TabContext>
            </Box>
        </section>
    );
};
