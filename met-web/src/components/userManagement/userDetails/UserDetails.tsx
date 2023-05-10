import React, { useContext, useState, ChangeEvent } from 'react';
import { Grid, FormControlLabel, Switch, Link as MuiLink } from '@mui/material';
import { MetLabel, MetParagraph, MetPageGridContainer, PrimaryButton } from 'components/common';
import MetTable from 'components/common/Table';
import { Link } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from 'hooks';
import { HeadCell } from 'components/common/Table/types';
import { ActionContext } from './UserActionProvider';
import { Engagement } from 'models/engagement';
import { openNotificationModal } from 'services/notificationModalService/notificationModalSlice';
import { openNotification } from 'services/notificationService/notificationSlice';
import { formatDate } from 'components/common/dateHelper';

export const UserDetails = () => {
    const { roles } = useAppSelector((state) => state.user);
    const { memberships, savedUser, setAddUserModalOpen, isUserLoading } = useContext(ActionContext);
    const [superUserAssigned, setSuperUser] = useState(false);
    const [deactivatedUser, setDeactivatedUser] = useState(false);
    const dispatch = useAppDispatch();

    const handleToggleChange = (event: ChangeEvent<HTMLInputElement>, checked: boolean) => {
        if (roles.includes('SuperUser')) {
            dispatch(
                openNotificationModal({
                    open: true,
                    data: {
                        header: `Assign Superuser to ${savedUser?.username}`,
                        subText: [
                            {
                                text: `You are attempting to give ${savedUser?.username} the SuperRole role`,
                            },
                            {
                                text: 'Are you sure?',
                            },
                        ],
                        handleConfirm: () => {
                            setSuperUser(!superUserAssigned);
                        },
                    },
                    type: 'confirm',
                }),
            );
        } else {
            dispatch(openNotification({ severity: 'error', text: 'You do not have permissions to give user roles' }));
        }
    };
    const handleUserDeactivated = (event: ChangeEvent<HTMLInputElement>, checked: boolean) => {
        if (roles.includes('SuperUser')) {
            dispatch(
                openNotificationModal({
                    open: true,
                    data: {
                        header: `Remove SuperUser role from ${savedUser?.username}`,
                        subText: [
                            {
                                text: `You are attempting to remove the SuperUser role from ${savedUser?.username}`,
                            },
                            {
                                text: 'Are you sure?',
                            },
                        ],
                        handleConfirm: () => {
                            setDeactivatedUser(!deactivatedUser);
                        },
                    },
                    type: 'confirm',
                }),
            );
        } else {
            dispatch(openNotification({ severity: 'error', text: 'You do not have permissions to remove user roles' }));
        }
    };

    const headCells: HeadCell<Engagement>[] = [
        {
            key: 'name',
            numeric: false,
            disablePadding: true,
            label: 'Engagement',
            allowSort: true,
            renderCell: (row: Engagement) => (
                <MuiLink component={Link} to={`/engagements/${Number(row.id)}/view`}>
                    {row.name}
                </MuiLink>
            ),
        },
    ];

    return (
        <MetPageGridContainer>
            <Grid container direction="row" item rowSpacing={1} sx={{ mb: 4 }}>
                <Grid container direction="row" item xs={6} spacing={1}>
                    <Grid item xs={2.5} sx={{ mr: 1 }}>
                        <MetLabel>User:</MetLabel>
                    </Grid>
                    <Grid item xs={2}>
                        <MetParagraph sx={{ pl: 2 }}>{savedUser?.first_name}</MetParagraph>
                    </Grid>
                </Grid>

                <Grid container direction="row" item xs={6} spacing={1}>
                    <Grid item xs={1.5} sx={{ mr: 1 }}>
                        <MetLabel>Role:</MetLabel>
                    </Grid>
                    <Grid item xs={2}>
                        <MetParagraph sx={{ pl: 2 }}>
                            {savedUser?.roles
                                ? savedUser?.roles.map((role, index) => (
                                    <React.Fragment key={role}>
                                        {role}
                                        {index < savedUser.roles.length - 1 ? ', ' : ''}
                                    </React.Fragment>
                                ))
                                : 'none'}
                        </MetParagraph>
                    </Grid>
                </Grid>

                <Grid container direction="row" item xs={6} spacing={1}>
                    <Grid item xs={2.5} sx={{ mr: 1 }}>
                        <MetLabel>Email:</MetLabel>
                    </Grid>
                    <Grid item xs={1.5}>
                        <MetParagraph sx={{ pl: 2 }}>{savedUser?.email_id}</MetParagraph>
                    </Grid>
                </Grid>

                <Grid container direction="row" item xs={6} spacing={1}>
                    <Grid item xs={12}>
                        <FormControlLabel
                            control={<Switch checked={superUserAssigned} onChange={handleToggleChange} />}
                            label={<MetLabel>Assign Superuser Role</MetLabel>}
                        />
                    </Grid>
                </Grid>

                <Grid container direction="row" item xs={6} spacing={1}>
                    <Grid item xs={2.5} sx={{ pt: 0, mt: 0, mr: 1, }}>
                        <MetLabel>Date Added:</MetLabel>
                    </Grid>
                    <Grid item xs={4.5}>
                        <MetParagraph sx={{ pl: 2 }}>
                            {savedUser ? formatDate(savedUser?.created_date) : ''}
                        </MetParagraph>
                    </Grid>
                </Grid>

                <Grid container direction="row" item xs={6} spacing={1}>
                    <Grid item xs={12}>
                        <FormControlLabel
                            control={<Switch checked={deactivatedUser} onChange={handleUserDeactivated} />}
                            label={<MetLabel>Deactivate User</MetLabel>}
                        />
                    </Grid>
                </Grid>
            </Grid>
            <Grid container item justifyContent={'flex-end'} alignItems={'flex-end'} xs={12}>
                <Grid item xs={6}></Grid>
                <Grid container justifyContent={'flex-end'} alignItems={'flex-end'} item xs={6}>
                    <PrimaryButton onClick={() => setAddUserModalOpen(true)}>+ Add an Engagement</PrimaryButton>
                </Grid>
            </Grid>
            <Grid item xs={12}>
                <MetTable headCells={headCells} rows={memberships} noPagination={true} loading={isUserLoading} />
            </Grid>
        </MetPageGridContainer>
    );
};

export default UserDetails;
