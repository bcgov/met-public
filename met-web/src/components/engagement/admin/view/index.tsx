import React, { Suspense, useEffect } from 'react';
import { useLoaderData, Await } from 'react-router-dom';
import { Engagement } from 'models/engagement';
import { AutoBreadcrumbs } from 'components/common/Navigation/Breadcrumb';
import { EngagementStatus } from 'constants/engagementStatus';
import { Theme, useMediaQuery } from '@mui/material';

export const AdminEngagementView = () => {
    const { engagement } = useLoaderData() as { engagement: Promise<Engagement> };
    const isMediumScreenOrLarger: boolean = useMediaQuery((theme: Theme) => theme.breakpoints.up('md'));

    return (
        <div style={{ marginTop: '3.125rem', padding: isMediumScreenOrLarger ? '0' : '0  1rem' }}>
            <AutoBreadcrumbs />
            <Suspense>
                <Await resolve={engagement}>
                    {(engagement: Engagement) => (
                        <div style={{ marginTop: '2rem' }}>
                            <span
                                style={{
                                    background: '#CE3E39',
                                    padding: '0.2rem 0.75rem',
                                    color: 'white',
                                    borderRadius: '3px',
                                    fontSize: '0.8rem',
                                }}
                            >
                                {EngagementStatus[engagement?.status_id]}
                            </span>
                            <h1 style={{ marginTop: '0.5rem' }}>{engagement?.name}</h1>
                        </div>
                    )}
                </Await>
            </Suspense>
        </div>
    );
};
