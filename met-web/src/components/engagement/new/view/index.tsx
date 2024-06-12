import { BodyText } from 'components/common/Typography';
import React, { Suspense } from 'react';
import { Await, useLoaderData, useParams } from 'react-router-dom';
import { Link } from 'components/common/Navigation';
import { Engagement } from 'models/engagement';
import { Box, Skeleton } from '@mui/material';
import { EngagementHero } from './EngagementHero';
import { colors } from 'components/common';

export const ViewEngagement = () => {
    const { slug, language } = useParams();
    const oldLink = `/${slug}/${language}`;
    const { engagement } = useLoaderData() as { engagement: Engagement };
    return (
        <main>
            <Suspense
                fallback={
                    <Skeleton
                        variant="rectangular"
                        sx={{
                            width: '100%',
                            height: {
                                xs: 'unset',
                                md: '840px',
                            },
                        }}
                    />
                }
            >
                <Await resolve={engagement}>
                    {(resolvedEngagement: Engagement) => <EngagementHero engagement={resolvedEngagement} />}
                </Await>
            </Suspense>
            <Box
                sx={{
                    background: colors.surface.blue[90],
                    color: colors.surface.white,
                    borderRadius: '0px 24px 0px 0px' /* upper right corner */,
                    padding: { xs: '32px 16px', md: '32px 5vw', lg: '32px 156px' },
                    marginTop: '-32px',
                    zIndex: 10,
                    position: 'relative',
                }}
            >
                <section id="cta-section">
                    {/* TODO: create dark theme provider for this area*/}
                    <BodyText sx={{ color: colors.surface.white }}>
                        You are viewing a <b>preview</b> of the new engagement page. It will replace the old page once
                        all features are completed.
                    </BodyText>
                    <BodyText sx={{ color: colors.surface.white }}>
                        For now, you can use the{' '}
                        <Link color="white" to={oldLink}>
                            existing page
                        </Link>{' '}
                        for access to all features.
                    </BodyText>
                    <BodyText sx={{ color: colors.surface.white }}>Work to be completed: </BodyText>
                    <ol>
                        <li>
                            <Link color="white" to="https://apps.itsm.gov.bc.ca/jira/browse/DESENG-636">
                                <s>Create new engagement view page</s>
                            </Link>
                        </li>
                        <li>
                            <Link color="white" to="https://apps.itsm.gov.bc.ca/jira/browse/DESENG-630">
                                <s>Add new header section to the new engagement view</s>
                            </Link>
                        </li>
                        <li>
                            <Link color="white" to="https://apps.itsm.gov.bc.ca/jira/browse/DESENG-631">
                                Add new Engagement description section
                            </Link>
                        </li>
                        <li>
                            <Link color="white" to="https://apps.itsm.gov.bc.ca/jira/browse/DESENG-632">
                                Add new Dynamic pages section
                            </Link>
                        </li>
                        <li>
                            <Link color="white" to="https://apps.itsm.gov.bc.ca/jira/browse/DESENG-633">
                                Add new Survey block section
                            </Link>
                        </li>
                    </ol>
                </section>
            </Box>
        </main>
    );
};

export default ViewEngagement;
