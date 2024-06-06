import React from 'react';

import { Grid } from '@mui/material';
import { ResponsiveContainer } from 'components/common/Layout';
import { Header1, Header2, BodyText } from 'components/common/Typography/';
import { TenantForm } from './TenantForm';
import { createTenant } from 'services/tenantService';
import { SubmitHandler } from 'react-hook-form';
import { Tenant } from 'models/tenant';
import { useAppDispatch } from 'hooks';
import { openNotification } from 'services/notificationService/notificationSlice';
import { useNavigate, useRevalidator } from 'react-router-dom';
import { AutoBreadcrumbs } from 'components/common/Navigation/Breadcrumb';

const TenantCreationPage = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const revalidator = useRevalidator();

    const onSubmit: SubmitHandler<Tenant> = async (data) => {
        try {
            await createTenant(data);
            dispatch(openNotification({ text: 'Tenant created successfully!', severity: 'success' }));
            revalidator.revalidate();
            navigate('/tenantadmin');
        } catch (error) {
            dispatch(openNotification({ text: 'Unknown error while creating tenant', severity: 'error' }));
            console.error(error);
        }
    };

    const onCancel = () => {
        navigate('/tenantadmin');
    };

    return (
        <ResponsiveContainer>
            <AutoBreadcrumbs />

            <Header1>Create Tenant Instance</Header1>
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
            <TenantForm onSubmit={onSubmit} submitText="Create Instance" onCancel={onCancel} />
        </ResponsiveContainer>
    );
};

export default TenantCreationPage;
