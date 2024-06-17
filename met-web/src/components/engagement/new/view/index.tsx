import { BodyText } from 'components/common/Typography';
import React, { Suspense } from 'react';
import { Await, useLoaderData, useParams } from 'react-router-dom';
import { Link } from 'components/common/Navigation';
import { Engagement } from 'models/engagement';
import { Box, Grid, Skeleton } from '@mui/material';
import { EngagementHero } from './EngagementHero';
import { colors } from 'components/common';
import { EngagementDescription } from './EngagementDescription';

export const ViewEngagement = () => {
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
            <Suspense fallback={<Skeleton variant="rectangular" sx={{ width: '100%', height: '480px' }} />}>
                <Await resolve={engagement}>
                    {(resolvedEngagement: Engagement) => <EngagementDescription engagement={resolvedEngagement} />}
                </Await>
            </Suspense>
        </main>
    );
};

export default ViewEngagement;

export { engagementLoader } from './EngagementLoader';
