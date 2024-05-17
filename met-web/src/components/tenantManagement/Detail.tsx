import React, { useEffect } from 'react';
import { Box, Grid, Skeleton, Button } from '@mui/material';
import { Header1, Header2, BodyText } from 'components/common/Typography/';
import { ResponsiveContainer } from 'components/common/Layout';
import { useParams } from 'react-router-dom';
import { getTenant } from 'services/tenantService';
import { useAppDispatch } from 'hooks';
import { openNotification } from 'services/notificationService/notificationSlice';
import { BreadcrumbTrail } from 'components/common/Navigation/Breadcrumb';
import { Tenant } from 'models/tenant';

const TenantDetail = () => {
    const [tenant, setTenant] = React.useState<Tenant | null>(null);
    const [loading, setLoading] = React.useState<boolean>(true);
    const { tenantId } = useParams<{ tenantId: string }>();
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (!tenantId) {
            return;
        }
        const fetchTenant = () => {
            getTenant(tenantId)
                .then((returnedTenant) => {
                    setTenant(returnedTenant);
                    setLoading(false);
                })
                .catch((error) => {
                    dispatch(openNotification({ text: error.message, severity: 'error' }));
                    setLoading(false);
                });
        };
        fetchTenant();
    }, [tenantId, dispatch]);

    if (loading || !tenant) {
        return (
            <ResponsiveContainer>
                <Skeleton variant="rectangular" height={40} />
                <Skeleton variant="text" width="60%" />
                <Skeleton variant="rectangular" height={20} />
                <Skeleton variant="text" width="80%" />
                <Skeleton variant="rectangular" height={200} />
                <Skeleton variant="text" width="40%" />
                <Skeleton variant="text" width="100%" />
            </ResponsiveContainer>
        );
    }

    return (
        <ResponsiveContainer>
            <BreadcrumbTrail
                smallScreenOnly
                crumbs={[
                    { name: 'Dashboard', link: '../home' },
                    { name: 'Tenant Admin', link: '../tenant-admin' },
                    { name: tenant.name },
                ]}
            />
            <Header1>{tenant.name}</Header1>
            <Box mt={2}>
                <Header2>Tenant Details</Header2>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <BodyText bold>Tenant Instance Name</BodyText>
                        <BodyText>{tenant.name}</BodyText>
                    </Grid>
                    <Grid item xs={12}>
                        <BodyText bold>Primary Contact</BodyText>
                        <BodyText>
                            {tenant.contact_name} ({tenant.contact_email})
                        </BodyText>
                    </Grid>
                    <Grid item xs={12}>
                        <BodyText bold>Short Name (URL)</BodyText>
                        <BodyText>{tenant.short_name}</BodyText>
                    </Grid>
                    <Grid item xs={12}>
                        <BodyText bold>Hero Banner Title</BodyText>
                        <BodyText>{tenant.title}</BodyText>
                    </Grid>
                    <Grid item xs={12}>
                        <BodyText bold>Hero Banner Description</BodyText>
                        <BodyText>{tenant.description}</BodyText>
                    </Grid>
                    <Grid item xs={12}>
                        <BodyText bold>Hero Banner Image</BodyText>
                        <Box>
                            <img src={tenant.logo_url} alt={tenant.title} style={{ width: '100%', height: 'auto' }} />
                        </Box>
                    </Grid>
                    <Grid item xs={12}>
                        <BodyText bold>Photo Credit</BodyText>
                        <BodyText>{tenant.logo_credit}</BodyText>
                    </Grid>
                    <Grid item xs={12}>
                        <BodyText bold>Description</BodyText>
                        <BodyText>{tenant.logo_description}</BodyText>
                    </Grid>
                </Grid>
            </Box>
            <Button
                variant="outlined"
                color="error"
                onClick={() => {
                    // TODO: Add delete functionality
                }}
                style={{ marginTop: '20px' }}
            >
                Delete Tenant Instance
            </Button>
        </ResponsiveContainer>
    );
};

export default TenantDetail;
