import React, { Suspense } from 'react';
import { BodyText, Header2 } from 'components/common/Typography';
import { Link } from 'components/common/Navigation';
import { Engagement } from 'models/engagement';
import { Grid2 as Grid, Skeleton, ThemeProvider } from '@mui/material';
import { colors } from 'components/common';
import { Await } from 'react-router';
import { getEditorStateFromRaw } from 'components/common/RichTextEditor/utils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeftLong } from '@fortawesome/pro-light-svg-icons';
import { WidgetLocation } from 'models/widget';
import { DarkTheme } from 'styles/Theme';
import { RichTextArea } from 'components/common/Input/RichTextArea';
import { EngagementViewSections } from '.';
import { usePreview } from 'components/engagement/preview/PreviewContext';
import { TextPlaceholder } from 'components/engagement/preview/placeholders/TextPlaceholder';
import { PreviewSwitch } from 'engagements/preview/PreviewSwitch';
import { EngagementPreviewTag } from './EngagementPreviewTag';
import { EngagementWidgetDisplay } from './EngagementWidgetDisplay';
import { useEngagementLoaderData } from 'components/engagement/preview/PreviewLoaderDataContext';

export const EngagementDescription = () => {
    const { engagement } = useEngagementLoaderData();
    const { isPreviewMode } = usePreview();
    return (
        <section
            id={EngagementViewSections.DESCRIPTION}
            aria-labelledby="description-header"
            style={{ position: 'relative' }}
        >
            <EngagementPreviewTag required>Summary Section</EngagementPreviewTag>
            <ThemeProvider theme={DarkTheme}>
                <Grid
                    container
                    size={12}
                    justifyContent="space-between"
                    spacing={8}
                    margin={0}
                    sx={{
                        background: colors.surface.blue[90],
                        color: colors.surface.white,
                        borderRadius: '0px 24px 0px 0px' /* upper right corner */,
                        padding: { xs: '43px 16px 24px 16px', md: '32px 5vw 40px 5vw', lg: '32px 10em 40px 10em' },
                        marginTop: '-56px',
                        zIndex: 10,
                        position: 'relative',
                        flexDirection: { xs: 'column', md: 'row' },
                    }}
                >
                    <Grid size={12}>
                        <Grid container component={Link} to={'/'} alignItems="center" display="flex">
                            <FontAwesomeIcon
                                icon={faArrowLeftLong}
                                color={colors.surface.white}
                                fontSize={'24px'}
                                style={{ paddingRight: '8px' }}
                            />
                            <BodyText thin size="small">
                                All engagements
                            </BodyText>
                        </Grid>
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }} direction="column" minHeight="120px">
                        <Suspense fallback={<Skeleton variant="rectangular" height="288px" width="100%" />}>
                            <Await resolve={engagement}>
                                {(engagement: Engagement) => {
                                    const summaryEditorState = getEditorStateFromRaw(engagement.rich_description);
                                    const hasSummaryBody =
                                        summaryEditorState?.getCurrentContent()?.hasText?.() ?? false;

                                    return (
                                        <>
                                            <Header2 decorated id="description-header" sx={{ mb: 1 }}>
                                                <PreviewSwitch
                                                    isPreviewMode={isPreviewMode}
                                                    hasValue={Boolean(engagement.description_title?.trim())}
                                                    value={engagement.description_title}
                                                    previewFallback={<TextPlaceholder text="Summary Section" />}
                                                />
                                            </Header2>
                                            <PreviewSwitch
                                                isPreviewMode={isPreviewMode}
                                                hasValue={hasSummaryBody}
                                                value={
                                                    <RichTextArea
                                                        toolbarHidden
                                                        readOnly
                                                        editorState={summaryEditorState}
                                                    />
                                                }
                                                previewFallback={<TextPlaceholder type="long" />}
                                            />
                                        </>
                                    );
                                }}
                            </Await>
                        </Suspense>
                    </Grid>
                    <Grid container size={{ xs: 12, md: 6 }} justifyContent="flex-end" alignItems="flex-start">
                        <EngagementWidgetDisplay location={WidgetLocation.Summary} />
                    </Grid>
                </Grid>
            </ThemeProvider>
        </section>
    );
};
