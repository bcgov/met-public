import React, { Suspense } from 'react';
import { BodyText, Header2 } from 'components/common/Typography';
import { Link } from 'components/common/Navigation';
import { Engagement } from 'models/engagement';
import { Grid, Skeleton, ThemeProvider } from '@mui/material';
import { colors } from 'components/common';
import { Await, useLoaderData } from 'react-router-dom';
import { getEditorStateFromRaw } from 'components/common/RichTextEditor/utils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeftLong } from '@fortawesome/pro-light-svg-icons';
import { Widget } from 'models/widget';
import { WidgetSwitch } from 'components/engagement/old-view/widgets/WidgetSwitch';
import { DarkTheme } from 'styles/Theme';
import { RichTextArea } from 'components/common/Input/RichTextArea';
import { EngagementViewSections } from '.';

export const EngagementDescription = () => {
    const { engagement, widgets } = useLoaderData() as { widgets: Widget[]; engagement: Engagement };
    return (
        <section id={EngagementViewSections.DESCRIPTION} aria-labelledby="description-header">
            <ThemeProvider theme={DarkTheme}>
                <Grid
                    container
                    justifyContent="space-between"
                    sx={{
                        width: '100%',
                        margin: 0,
                        background: colors.surface.blue[90],
                        color: colors.surface.white,
                        borderRadius: '0px 24px 0px 0px' /* upper right corner */,
                        padding: { xs: '43px 16px 24px 16px', md: '32px 5vw 40px 5vw', lg: '32px 156px 40px 156px' },
                        marginTop: '-56px',
                        zIndex: 10,
                        position: 'relative',
                        flexDirection: { xs: 'column', md: 'row' },
                    }}
                >
                    <Grid
                        item
                        sx={{
                            width: '100%',
                            display: 'flex',
                            flexDirection: 'row',
                            marginBottom: { xs: '24px', md: '48px' },
                        }}
                    >
                        <Grid item container component={Link} to={'/'} alignItems="center" display="flex">
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
                    <Grid
                        item
                        sx={{
                            width: { xs: '100%', md: '47.5%' },
                            display: 'flex',
                            flexDirection: 'column',
                            minHeight: '120px',
                            marginBottom: '48px',
                        }}
                    >
                        <Suspense fallback={<Skeleton variant="rectangular" sx={{ width: '100%', height: '288px' }} />}>
                            <Await resolve={engagement}>
                                {(engagement: Engagement) => (
                                    <>
                                        <Header2 decorated id="description-header" sx={{ mb: 1 }}>
                                            {engagement.description_title}
                                        </Header2>
                                        <BodyText>
                                            <RichTextArea
                                                toolbarHidden
                                                readOnly
                                                editorState={getEditorStateFromRaw(engagement.rich_description)}
                                            />
                                        </BodyText>
                                    </>
                                )}
                            </Await>
                        </Suspense>
                    </Grid>
                    <Suspense fallback={<Skeleton variant="rectangular" sx={{ width: '100%', height: '360px' }} />}>
                        <Await resolve={widgets}>
                            {(resolvedWidgets: Widget[]) => {
                                const widget = resolvedWidgets[0];
                                if (widget)
                                    return (
                                        <Grid
                                            item
                                            sx={{
                                                width: { xs: '100%', md: '47.5%' },
                                                display: 'flex',
                                                minHeight: '360px',
                                                marginBottom: '48px',
                                            }}
                                        >
                                            <WidgetSwitch widget={widget} />
                                        </Grid>
                                    );
                            }}
                        </Await>
                    </Suspense>
                </Grid>
            </ThemeProvider>
        </section>
    );
};
