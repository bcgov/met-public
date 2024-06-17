import React, { Suspense } from 'react';
import { Await, useLoaderData } from 'react-router-dom';
import { Engagement } from 'models/engagement';
import { Skeleton } from '@mui/material';
import { EngagementHero } from './EngagementHero';
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
