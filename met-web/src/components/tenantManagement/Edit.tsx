import React, { useEffect } from 'react';

import { Grid } from '@mui/material';
import { ResponsiveContainer } from 'components/common/Layout';
import { Header1, Header2, BodyText } from 'components/common/Typography/';
import { BreadcrumbTrail } from 'components/common/Navigation';
import { TenantForm } from './TenantForm';
import { updateTenant, getTenant } from 'services/tenantService';
import { SubmitHandler } from 'react-hook-form';
import { Tenant } from 'models/tenant';
import { useAppDispatch } from 'hooks';
import { openNotification } from 'services/notificationService/notificationSlice';
import { useNavigate, useParams } from 'react-router-dom';
import NotFound from 'routes/NotFound';
import { MidScreenLoader } from 'components/common';

const TenantEditPage = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { tenantShortName: shortName } = useParams<{ tenantShortName: string }>();
    const [tenant, setTenant] = React.useState<Tenant>();
    const [loading, setLoading] = React.useState<boolean>(true);

    useEffect(() => {
        const fetchTenant = async () => {
            if (!shortName) {
                setLoading(false);
                return;
            }
            try {
                const tenant = await getTenant(shortName);
                setTenant(tenant);
                setLoading(false);
            } catch (error) {
                setLoading(false);
            }
        };

        fetchTenant();
    }, [shortName, dispatch]);

    if (loading) {
        return <MidScreenLoader />;
    }

    if (!tenant || !shortName) {
        return <NotFound />;
    }

    const onSubmit: SubmitHandler<Tenant> = async (data) => {
        try {
            await updateTenant(data, shortName);
            dispatch(openNotification({ text: 'Tenant updated successfully!', severity: 'success' }));
            navigate('../tenantadmin');
        } catch (error) {
            dispatch(openNotification({ text: 'Unknown error while saving tenant', severity: 'error' }));
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
            <TenantForm initialTenant={tenant} onSubmit={onSubmit} submitText="Update" onCancel={onCancel} />
        </ResponsiveContainer>
    );
};

export default TenantEditPage;
