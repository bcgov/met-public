import React, { Suspense } from 'react';

import { Grid } from '@mui/material';
import { ResponsiveContainer } from 'components/common/Layout';
import { Header1, Header2, BodyText } from 'components/common/Typography/';
import { TenantForm } from './TenantForm';
import { updateTenant } from 'services/tenantService';
import { SubmitHandler } from 'react-hook-form';
import { Tenant } from 'models/tenant';
import { useAppDispatch } from 'hooks';
import { openNotification } from 'services/notificationService/notificationSlice';
import { useRouteLoaderData, useNavigate, Await, useRevalidator } from 'react-router-dom';
import { MidScreenLoader } from 'components/common';
// Prevents page load fail due to waiting for engagement title on refresh
const AutoBreadcrumbs = React.lazy(() =>
    import('components/common/Navigation/Breadcrumb').then((m) => ({ default: m.AutoBreadcrumbs })),
);

const TenantEditPage = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const revalidator = useRevalidator();
    const tenant = useRouteLoaderData('tenant') as Promise<Tenant>;

    return (
        <Suspense fallback={<MidScreenLoader />}>
            <Await resolve={tenant}>
                {(resolvedTenant) => {
                    const shortName = resolvedTenant?.short_name;
                    const onCancel = () => {
                        navigate(`/tenantadmin/${shortName}/detail`);
                    };
                    const onSubmit: SubmitHandler<Tenant> = async (data) => {
                        try {
                            await updateTenant(data, shortName);
                            dispatch(openNotification({ text: 'Tenant updated successfully!', severity: 'success' }));
                            revalidator.revalidate();
                            navigate(`/tenantadmin/${shortName}/detail`);
                        } catch (error) {
                            dispatch(
                                openNotification({ text: 'Unknown error while saving tenant', severity: 'error' }),
                            );
                            console.error(error);
                        }
                    };
                    return (
                        <ResponsiveContainer>
                            <AutoBreadcrumbs />

                            <Header1>Edit Tenant Instance</Header1>
                            <Grid container spacing={0} direction="column" mb="0.5em">
                                <Grid item xs={12}>
                                    <Header2 decorated sx={{ mb: 0 }}>
                                        Tenant Details
                                    </Header2>
                                </Grid>
                                <Grid item xs={12}>
                                    <BodyText size="small">* Required fields</BodyText>
                                </Grid>
                            </Grid>
                            <TenantForm
                                initialTenant={resolvedTenant}
                                onSubmit={onSubmit}
                                submitText="Update"
                                onCancel={onCancel}
                            />
                        </ResponsiveContainer>
                    );
                }}
            </Await>
        </Suspense>
    );
};

export default TenantEditPage;
