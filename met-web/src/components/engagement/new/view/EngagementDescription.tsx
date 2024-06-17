import React, { Suspense } from 'react';
import { BodyText, Header2 } from 'components/common/Typography';
import { Link } from 'components/common/Navigation';
import { Engagement } from 'models/engagement';
import { Grid, Skeleton } from '@mui/material';
import { colors } from 'components/common';
import { Await, useLoaderData } from 'react-router-dom';
import { Editor } from 'react-draft-wysiwyg';
import { getEditorStateFromRaw } from 'components/common/RichTextEditor/utils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeftLong } from '@fortawesome/pro-light-svg-icons';
import { Widget } from 'models/widget';
import { WidgetSwitch } from 'components/engagement/view/widgets/WidgetSwitch';

export const EngagementDescription = ({ engagement }: { engagement: Engagement }) => {
    const { widgets } = useLoaderData() as { widgets: Widget[] };
    return (
        <section id="cta-section">
            <Grid
                container
                justifyContent="space-between"
                sx={{
                    width: '100%',
                    margin: 0,
                    background: colors.surface.blue[90],
                    color: colors.surface.white,
                    borderRadius: '0px 24px 0px 0px' /* upper right corner */,
                    padding: { xs: '43px 16px 75px 16px', md: '32px 5vw 88px 5vw', lg: '32px 156px 88px 156px' },
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
                    <Grid item component={Link} to={'/'} alignItems="center" display="flex">
                        <FontAwesomeIcon
                            icon={faArrowLeftLong}
                            color={colors.surface.white}
                            fontSize={'24px'}
                            style={{ paddingRight: '8px' }}
                        />
                        <BodyText thin size="small" sx={{ color: colors.surface.white }}>
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
                    }}
                >
                    <Header2 decorated weight="thin" sx={{ color: colors.surface.white }}>
                        Engagement Description
                    </Header2>
                    <BodyText
                        sx={{
                            color: colors.surface.white,
                            '& .rdw-link-decorator-icon': { display: 'none' },
                            '& a': {
                                color: colors.surface.white,
                                textDecoration: 'underline',
                            },
                        }}
                    >
                        <Editor
                            editorState={getEditorStateFromRaw(engagement.rich_description)}
                            readOnly={true}
                            toolbarHidden
                        />
                    </BodyText>
                </Grid>
                <Grid
                    item
                    sx={{
                        width: { xs: '100%', md: '47.5%' },
                        display: 'flex',
                        minHeight: '360px',
                    }}
                >
                    <Suspense fallback={<Skeleton variant="rectangular" sx={{ width: '100%', height: '360px' }} />}>
                        <Await resolve={widgets}>
                            {(resolvedWidgets: Widget[]) => {
                                const widget = resolvedWidgets?.[0];
                                return widget && <WidgetSwitch widget={widget} />;
                            }}
                        </Await>
                    </Suspense>
                </Grid>
            </Grid>
        </section>
    );
};
