import React, { useEffect } from 'react';
import { Box, Grid, Skeleton } from '@mui/material';
import { Header1, Header2, BodyText } from 'components/common/Typography/';
import { ResponsiveContainer } from 'components/common/Layout';
import { useParams } from 'react-router-dom';
import { getTenant, deleteTenant } from 'services/tenantService';
import { useAppDispatch } from 'hooks';
import { openNotification } from 'services/notificationService/notificationSlice';
import { BreadcrumbTrail } from 'components/common/Navigation/Breadcrumb';
import { Tenant } from 'models/tenant';
import { DetailsContainer, Detail } from 'components/common/Layout';
import { useNavigate } from 'react-router-dom';
import { Button } from 'components/common/Input/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faTrashCan, faCopy } from '@fortawesome/pro-regular-svg-icons';
import { openNotificationModal } from 'services/notificationModalService/notificationModalSlice';
import LandingPageBanner from 'assets/images/LandingPageBanner.png';
import { globalFocusVisible } from 'components/common';

const TenantDetail = () => {
    const [tenant, setTenant] = React.useState<Tenant | null>(null);
    const [loading, setLoading] = React.useState<boolean>(true);
    const navigate = useNavigate();
    const { tenantId } = useParams<{ tenantId: string }>();
    const dispatch = useAppDispatch();
    const penToSquareIcon = <FontAwesomeIcon icon={faPenToSquare} />;
    const trashCanIcon = <FontAwesomeIcon icon={faTrashCan} />;
    const faCopyIcon = <FontAwesomeIcon icon={faCopy} style={{ color: '#063064', marginLeft: '2px' }} />;

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
                <BreadcrumbTrail
                    smallScreenOnly
                    crumbs={[
                        { name: 'Dashboard', link: '../home' },
                        { name: 'Tenant Admin', link: '../tenantadmin' },
                        { name: 'Loading...' },
                    ]}
                />
                <Skeleton variant="text" width="40%">
                    <Header1>Loading...</Header1>
                </Skeleton>
                <Grid container spacing={0} direction="row" mb="0.5em">
                    <Grid item xs={12} sm={7} lg={9}>
                        <Skeleton variant="text" width="60%">
                            <Header2 decorated>Loading...</Header2>
                        </Skeleton>
                    </Grid>
                    <Grid item xs="auto" sm={5} lg={3} sx={{ textAlign: 'right' }}>
                        <Skeleton variant="rectangular" height={36} width={100} />
                    </Grid>
                </Grid>
                <Box
                    style={{
                        display: 'block',
                        overflowX: 'auto',
                        width: 'calc(100% + 4px)',
                        padding: '0px 2px 2px',
                        margin: '0px -2px -2px',
                    }}
                >
                    <DetailsContainer
                        sx={{
                            margin: {
                                xs: '0 -16px',
                                sm: '0',
                            },
                        }}
                    >
                        <Detail>
                            <Skeleton variant="text" width="40%">
                                <BodyText bold>Loading...</BodyText>
                            </Skeleton>
                            <Skeleton variant="text" width="80%">
                                <BodyText>Loading...</BodyText>
                            </Skeleton>
                        </Detail>

                        <Detail>
                            <Skeleton variant="text" width="40%">
                                <BodyText bold>Loading...</BodyText>
                            </Skeleton>
                            <Skeleton variant="text" width="80%">
                                <BodyText>Loading...</BodyText>
                            </Skeleton>
                        </Detail>

                        <Detail>
                            <Skeleton variant="text" width="40%">
                                <BodyText bold>Loading...</BodyText>
                            </Skeleton>
                            <Skeleton variant="text" width="80%">
                                <BodyText>Loading...</BodyText>
                            </Skeleton>
                        </Detail>

                        <Detail>
                            <Skeleton variant="text" width="40%">
                                <BodyText bold>Loading...</BodyText>
                            </Skeleton>
                            <Skeleton variant="text" width="80%">
                                <BodyText>Loading...</BodyText>
                            </Skeleton>
                        </Detail>

                        <Detail>
                            <Skeleton variant="text" width="40%">
                                <BodyText bold>Loading...</BodyText>
                            </Skeleton>
                            <Skeleton variant="text" width="80%">
                                <BodyText>Loading...</BodyText>
                            </Skeleton>
                        </Detail>

                        <Detail>
                            <Skeleton variant="rectangular" height={166} width="100%" />
                            <Skeleton variant="text" width="40%">
                                <BodyText bold>Loading...</BodyText>
                            </Skeleton>
                            <Skeleton variant="text" width="80%">
                                <BodyText>Loading...</BodyText>
                            </Skeleton>
                            <Skeleton variant="text" width="40%">
                                <BodyText bold>Loading...</BodyText>
                            </Skeleton>
                            <Skeleton variant="text" width="80%">
                                <BodyText>Loading...</BodyText>
                            </Skeleton>
                        </Detail>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <Skeleton variant="rectangular" height={36} width={100} />
                            </Grid>
                        </Grid>
                    </DetailsContainer>
                </Box>
            </ResponsiveContainer>
        );
    }

    const handleDeleteTenant = async (tenantId: string) => {
        try {
            await deleteTenant(tenantId);
            dispatch(
                openNotification({
                    severity: 'success',
                    text: `Tenant "${tenantId}" successfully deleted`,
                }),
            );
            navigate('../tenantadmin');
        } catch (error) {
            console.log(error);
            dispatch(
                openNotification({
                    severity: 'error',
                    text: `Error occurred while trying to delete tenant "${tenantId}"`,
                }),
            );
        }
    };

    const handleDeleteClick = (tenant: Tenant) => {
        dispatch(
            openNotificationModal({
                open: true,
                data: {
                    style: 'danger',
                    header: 'Delete Tenant Instance?',
                    subHeader: `Are you sure you want to delete "${tenant.name}"?`,
                    subText: [
                        {
                            text: 'If you delete this tenant, all the data associated with it will be deleted. This action cannot be undone.',
                        },
                    ],
                    handleConfirm: () => {
                        handleDeleteTenant(tenant.short_name);
                    },
                },
                type: 'confirm',
            }),
        );
    };

    const copyEmail = () => {
        navigator.clipboard.writeText(tenant.contact_email ?? '');
        dispatch(openNotification({ text: 'Copied to clipboard', severity: 'info' }));
    };

    return (
        <ResponsiveContainer>
            <BreadcrumbTrail
                smallScreenOnly
                crumbs={[
                    { name: 'Dashboard', link: '../home' },
                    { name: 'Tenant Admin', link: '../tenantadmin' },
                    { name: tenant.name ? tenant.name : tenant.title },
                ]}
            />
            <Header1>{tenant.name}</Header1>
            <Grid container spacing={0} direction="row" mb="0.5em">
                <Grid item xs={12} sm={7} lg={9}>
                    <Header2 decorated>Tenant Details</Header2>
                </Grid>
                <Grid item xs="auto" sm={5} lg={3} sx={{ textAlign: 'right' }}>
                    <Button
                        variant="primary"
                        icon={penToSquareIcon}
                        onClick={() => {
                            navigate(`/tenantadmin/${tenant.short_name}/edit`);
                        }}
                    >
                        Edit
                    </Button>
                </Grid>
            </Grid>
            <Box
                style={{
                    // Allow the table to scroll horizontally
                    display: 'block',
                    overflowX: 'auto',
                    // Allow the keyboard focus outline on table rows to
                    // display outside the scrollable area
                    width: 'calc(100% + 4px)',
                    padding: '0px 2px 2px',
                    margin: '0px -2px -2px',
                }}
            >
                <DetailsContainer
                    sx={{
                        margin: {
                            // on small screens, negate the padding of the ResponsiveContainer
                            // so the container hugs the edge of the screen
                            xs: '0 -16px',
                            sm: '0',
                        },
                    }}
                >
                    <Detail>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <BodyText bold>Tenant Instance Name</BodyText>
                                <BodyText>{tenant.name}</BodyText>
                            </Grid>
                        </Grid>
                    </Detail>

                    <Detail>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <BodyText bold>Primary Contact</BodyText>
                                <Grid container alignItems="center">
                                    <Grid item xs>
                                        <BodyText>{tenant.contact_name}</BodyText>
                                    </Grid>
                                    <Grid
                                        item
                                        xs="auto"
                                        component={'a'}
                                        tabIndex={0}
                                        target="#"
                                        sx={{
                                            cursor: 'pointer',
                                            display: { xs: 'none', sm: 'block' },
                                            ...globalFocusVisible,
                                        }}
                                        onClick={copyEmail}
                                        onKeyDown={(e: React.KeyboardEvent<HTMLAnchorElement>) => {
                                            if (e.key === 'Enter' || e.key === ' ') {
                                                e.preventDefault();
                                                copyEmail();
                                            }
                                        }}
                                    >
                                        <BodyText>
                                            {tenant.contact_email} {faCopyIcon}
                                        </BodyText>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Detail>

                    <Detail>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <BodyText bold>Short Name</BodyText>
                                <BodyText>{tenant.short_name}</BodyText>
                            </Grid>
                        </Grid>
                    </Detail>

                    <Detail>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <BodyText bold>Hero Banner Title</BodyText>
                                <BodyText>{tenant.title}</BodyText>
                            </Grid>
                        </Grid>
                    </Detail>

                    <Detail>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <BodyText bold>Hero Banner Description</BodyText>
                                <BodyText>{tenant.description}</BodyText>
                            </Grid>
                        </Grid>
                    </Detail>

                    <Detail>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <BodyText bold>Hero Banner Image</BodyText>
                                <div
                                    style={{
                                        height: '166px',
                                        alignSelf: 'stretch',
                                        margin: '16px 0',
                                        backgroundImage: `url(${tenant.logo_url || LandingPageBanner})`,
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                    }}
                                />
                            </Grid>
                            {tenant.logo_credit && (
                                <Grid item xs={12}>
                                    <BodyText bold>Photo Credit</BodyText>
                                    <BodyText>{tenant.logo_credit}</BodyText>
                                </Grid>
                            )}
                            {tenant.logo_description && (
                                <Grid item xs={12}>
                                    <BodyText bold>Description</BodyText>
                                    <BodyText>{tenant.logo_description}</BodyText>
                                </Grid>
                            )}
                        </Grid>
                    </Detail>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Button
                                variant="secondary"
                                color="danger"
                                icon={trashCanIcon}
                                onClick={() => {
                                    handleDeleteClick(tenant);
                                }}
                                sx={{ marginTop: '20px' }}
                            >
                                Delete Tenant Instance
                            </Button>
                        </Grid>
                    </Grid>
                </DetailsContainer>
            </Box>
        </ResponsiveContainer>
    );
};

export default TenantDetail;
