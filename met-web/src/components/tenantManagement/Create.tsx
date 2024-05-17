import React from 'react';

import { Grid } from '@mui/material';
import { ResponsiveContainer } from 'components/common/Layout';
import { Header1, Header2, BodyText } from 'components/common/Typography/';
import { BreadcrumbTrail } from 'components/common/Navigation';
import { TenantForm } from './TenantForm';
import { createTenant } from 'services/tenantService';
import { SubmitHandler } from 'react-hook-form';
import { Tenant } from 'models/tenant';
import { useAppDispatch } from 'hooks';
import { openNotification } from 'services/notificationService/notificationSlice';
import { useNavigate } from 'react-router-dom';

const TenantCreationPage = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const onSubmit: SubmitHandler<Tenant> = async (data) => {
        try {
            await createTenant(data);
            dispatch(openNotification({ text: 'Tenant created successfully!', severity: 'success' }));
            navigate('../tenantadmin');
        } catch (error) {
            dispatch(openNotification({ text: 'Unknown error while creating tenant', severity: 'error' }));
            console.error(error);
        }
    };

    const onCancel = () => {
        navigate('../tenantadmin');
    };

    return (
        <ResponsiveContainer>
            <BreadcrumbTrail
                smallScreenOnly
                crumbs={[
                    { name: 'Dashboard', link: '../../home' },
                    { name: 'Tenant Admin', link: '../tenantadmin' },
                    { name: 'Create Tenant Instance' },
                ]}
            />

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
            <TenantForm onSubmit={onSubmit} onCancel={onCancel} />
        </ResponsiveContainer>
    );
};

export default TenantCreationPage;
