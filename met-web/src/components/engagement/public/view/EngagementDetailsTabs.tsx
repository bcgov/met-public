import React, { useEffect, useState } from 'react';
import { Tab, Grid2 as Grid, useMediaQuery, Theme } from '@mui/material';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { getEditorStateFromRaw } from 'components/common/RichTextEditor/utils';
import { Header2 } from 'components/common/Typography';
import { colors } from 'components/common';
import { RichTextArea } from 'components/common/Input/RichTextArea';
import { EngagementLoaderPublicData, EngagementViewSections } from '.';
import { FormDetailsTab } from 'engagements/admin/create/authoring/types';
import { EngagementDetailsTab } from 'models/engagementDetailsTab';
import { EngagementPreviewTag } from './EngagementPreviewTag';
import { useEngagementLoaderData } from 'components/engagement/preview/PreviewLoaderDataContext';
import { EngagementWidgetDisplay } from './EngagementWidgetDisplay';
import { WidgetLocation } from 'models/widget';
import TextPlaceholder from 'engagements/preview/placeholders/TextPlaceholder';
import { PreviewSwitch } from 'engagements/preview/PreviewSwitch';
import { usePreview } from 'components/engagement/preview/PreviewContext';

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
    const { details } = useEngagementLoaderData() as EngagementLoaderPublicData; // Get fresh data to avoid DB sync issues
    const [selectedTab, setSelectedTab] = useState('0');
    const [tabs, setTabs] = useState<FormDetailsTabWithWidget[]>([]);
    const { isPreviewMode } = usePreview();
    const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'), { noSsr: true });

    useEffect(() => {
        details.then((d) => {
            setTabs(parseAndSortTabs(d));
        });
    }, [details]);

    // STYLES

    const containerStyles = {
        padding: { xs: '0 16px 24px 16px', md: '0 5vw 40px 5vw', lg: '0 10em 40px 10em' },
        boxSizing: 'border-box',
        marginTop: 0,
        position: 'relative',
        zIndex: 10,
    };

    const tabListStyles = {
        mb: '1rem',
        width: '100%',
        '& .MuiTabs-scroller': {
            width: 'max-content',
            pb: '1rem',
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
            width: 'max-content',
        },
        '& .Mui-focusVisible': {
            outline: `2px solid`,
            outlineColor: 'focus.inner',
            border: '4px solid',
            borderColor: 'focus.outer',
            padding: '0px 20px 0px 14px',
        },
    };

    const tabStyles = {
        width: 'max-content',
        maxWidth: '100%',
        color: colors.type.regular.primary,
        background: 'transparent',
        minWidth: '3rem',
        fontSize: '14px',
        fontWeight: 'normal',
        mr: { xs: 0, md: '2rem' },
        padding: { xs: '0.75rem', md: '1.25rem 0' },
        mt: '0.75rem',
        alignItems: { xs: 'flex-start', md: 'center' },
        '&.Mui-selected': {
            fontWeight: 'bold',
        },
    };

    const tabIndicatorStyles = { marginBottom: '16px' };

    const tabLayoutStyles = {
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        width: '100%',
        gap: '3rem',
    };

    const hasBodyContent = (tab: FormDetailsTabWithWidget) => tab.body?.getCurrentContent()?.hasText?.() ?? false;
    const displayTabs =
        tabs.length > 0
            ? tabs
            : isPreviewMode
              ? [
                    {
                        id: -1,
                        engagement_id: 0,
                        label: '',
                        slug: '',
                        heading: '',
                        body: getEditorStateFromRaw(''),
                        sort_index: 0,
                        widget: true,
                    } as FormDetailsTabWithWidget,
                ]
              : [];

    return (
        <section
            id={EngagementViewSections.DETAILS_TABS}
            aria-label="Engagement details tabs"
            style={{ position: 'relative' }}
        >
            <EngagementPreviewTag required>Details Section</EngagementPreviewTag>
            <Grid container sx={{ ...containerStyles, minHeight: '500px' }}>
                {displayTabs.length > 0 && (
                    <TabContext value={selectedTab}>
                        <TabList
                            onChange={(_, value) => setSelectedTab(value)}
                            orientation="horizontal"
                            variant={isMobile ? 'scrollable' : 'standard'}
                            scrollButtons={false}
                            slotProps={{ indicator: { sx: tabIndicatorStyles } }}
                            sx={tabListStyles}
                            selectionFollowsFocus
                        >
                            {displayTabs.map((tab, key) => (
                                <Tab
                                    sx={tabStyles}
                                    key={tab.id}
                                    label={tab.label || `Tab ${key + 1} Label`}
                                    aria-label={tab.label || `Tab ${key + 1} Label`}
                                    value={String(key)}
                                    disableRipple
                                />
                            ))}
                        </TabList>
                        {displayTabs.map((tab, key) => (
                            <TabPanel key={tab.id} value={String(key)} sx={{ padding: '1.5rem 0', width: '100%' }}>
                                <Grid container sx={tabLayoutStyles} direction="row" size={12}>
                                    <Grid size={{ xs: 12, md: 6, lg: 8 }}>
                                        <Header2
                                            decorated
                                            weight="thin"
                                            aria-label={tab.heading || `Tab ${key + 1} Heading`}
                                        >
                                            <PreviewSwitch
                                                isPreviewMode={isPreviewMode}
                                                hasValue={Boolean(tab.heading?.trim())}
                                                value={tab.heading}
                                                previewFallback={<TextPlaceholder text={`Tab ${key + 1} Heading`} />}
                                            />
                                        </Header2>
                                        <PreviewSwitch
                                            isPreviewMode={isPreviewMode}
                                            hasValue={hasBodyContent(tab)}
                                            value={
                                                <RichTextArea
                                                    maxLines={isMobile ? 15 : 9} // Lines are short on mobile, show a few more.
                                                    editorState={tab.body}
                                                    readOnly={true}
                                                    toolbarHidden
                                                />
                                            }
                                            previewFallback={<TextPlaceholder type="long" />}
                                        />
                                    </Grid>
                                    <Grid size="grow">
                                        <EngagementWidgetDisplay
                                            location={WidgetLocation.Details}
                                            detailsTabId={tab.id > 0 ? tab.id : undefined}
                                            tabIndex={key + 1}
                                        />
                                    </Grid>
                                </Grid>
                            </TabPanel>
                        ))}
                    </TabContext>
                )}
            </Grid>
        </section>
    );
};
