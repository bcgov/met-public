import { faCirclePlus } from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Box, Grid, Skeleton } from '@mui/material';
import { Button } from 'components/common/Input/Button';
import { Header1, Header2, BodyText } from 'components/common/Typography/';
import { ResponsiveContainer } from 'components/common/Layout';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeadCell,
    TableHeadRow,
    TableRow,
} from 'components/common/Layout/Table';
import { getAllTenants } from 'services/tenantService';

import React, { useEffect } from 'react';
import { Tenant } from 'models/tenant';
import { Else, If, Then } from 'react-if';
import { BreadcrumbTrail } from 'components/common/Navigation/Breadcrumb';
import { useAppDispatch } from 'hooks';
import { openNotification } from 'services/notificationService/notificationSlice';
import { useNavigate } from 'react-router-dom';

const TenantListingPage = () => {
    const [tenants, setTenants] = React.useState<Tenant[]>([]);
    const [loading, setLoading] = React.useState<boolean>(true);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const circlePlusIcon = <FontAwesomeIcon icon={faCirclePlus} />;
    useEffect(() => {
        const fetchTenants = () => {
            getAllTenants()
                .then((returnedTenants) => {
                    setTenants(returnedTenants);
                    setLoading(false);
                })
                .catch((error) => {
                    dispatch(openNotification({ text: error.message, severity: 'error' }));
                    setLoading(false);
                });
        };
        fetchTenants();
    }, []);

    return (
        <ResponsiveContainer>
            <BreadcrumbTrail
                smallScreenOnly
                crumbs={[{ name: 'Dashboard', link: '../home' }, { name: 'Tenant Admin' }]}
            />

            <Header1>Tenant Admin</Header1>
            <Grid container spacing={0} direction="row" mb="0.5em">
                <Grid item xs={12} sm={7} lg={9}>
                    <Header2 decorated>Tenant Instances {!loading && `(${tenants.length})`}</Header2>
                </Grid>
                <Grid item xs="auto" sm={5} lg={3} sx={{ textAlign: 'right' }}>
                    <Button
                        variant="primary"
                        icon={circlePlusIcon}
                        onClick={() => {
                            navigate('./create');
                        }}
                    >
                        Add Instance
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
                <Table>
                    <TableHead>
                        <TableHeadRow>
                            <TableHeadCell sx={{ minWidth: '240px' }}>Name</TableHeadCell>
                            <TableHeadCell sx={{ minWidth: '480px' }}>Description</TableHeadCell>
                        </TableHeadRow>
                    </TableHead>
                    <TableBody>
                        <If condition={loading}>
                            <Then>
                                {[...Array(5)].map((_, index) => (
                                    <TableRow key={index}>
                                        <TableCell>
                                            <Skeleton variant="text" width={240} />
                                            <Skeleton variant="text" width={240} />
                                        </TableCell>
                                        <TableCell>
                                            <Skeleton variant="text" width={480} />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </Then>
                            <Else>
                                {tenants.map((tenant) => (
                                    <TableRow
                                        onClick={() => {
                                            return;
                                        }}
                                        key={tenant.name}
                                        tabIndex={0}
                                    >
                                        <TableCell>
                                            <BodyText bold style={{ marginBottom: '8px' }}>
                                                {tenant.name}
                                            </BodyText>
                                            {/* TODO: Replace when primary contact info is added to tenants */}
                                            <BodyText size="small">{tenant.contact_name}</BodyText>
                                        </TableCell>
                                        <TableCell>
                                            <BodyText size="small">{tenant.description}</BodyText>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </Else>
                        </If>
                    </TableBody>
                </Table>
            </Box>
        </ResponsiveContainer>
    );
};

export default TenantListingPage;
