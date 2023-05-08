import React, { useContext, useState, ChangeEvent } from 'react';
import { Grid, FormControlLabel, Switch } from '@mui/material';
import { MetLabel, MetParagraph, MetPageGridContainer, PrimaryButton } from 'components/common';
import MetTable from 'components/common/Table';
import { useAppSelector } from 'hooks';
import { HeadCell, PaginationOptions } from 'components/common/Table/types';
import { ActionContext } from './UserActionProvider';
import { EngagementTeamMember } from 'models/engagementTeamMember';
import { openNotificationModal } from 'services/notificationModalService/notificationModalSlice';
import { useAppDispatch } from 'hooks';
import { openNotification } from 'services/notificationService/notificationSlice';

export const UserDetails = () => {
    const { roles } = useAppSelector((state) => state.user);
    const {
        pageInfo,
        paginationOptions,
        setPaginationOptions,
        memberships,
        savedUser,
        setAddUserModalOpen,
        isUserLoading,
    } = useContext(ActionContext);
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

    const headCells: HeadCell<EngagementTeamMember>[] = [
        {
            key: 'engagement_id',
            numeric: false,
            disablePadding: true,
            label: 'Engagement',
            allowSort: true,
            renderCell: (row: EngagementTeamMember) => row.engagement_id,
        },
        {
            key: 'user_id',
            numeric: false,
            disablePadding: true,
            label: 'Added By',
            allowSort: true,
            renderCell: (row: EngagementTeamMember) => {
                return row.user_id;
            },
        },
        {
            key: 'created_date',
            numeric: false,
            disablePadding: true,
            label: 'Date Added',
            allowSort: true,
            renderCell: (row: EngagementTeamMember) => row.created_date,
        },
    ];

    return (
        <MetPageGridContainer>
            <Grid container direction="row" item rowSpacing={1} sx={{ mb: 4 }}>
                <Grid container direction="row" item xs={6} spacing={1}>
                    <Grid item xs={1.5} sx={{ mr: 1 }}>
                        <MetLabel>User:</MetLabel>
                    </Grid>
                    <Grid item xs={2}>
                        <MetParagraph sx={{ pl: 2 }}>{savedUser && savedUser?.first_name}</MetParagraph>
                    </Grid>
                </Grid>

                <Grid container direction="row" item xs={6} spacing={1}>
                    <Grid item xs={1.5} sx={{ mr: 1 }}>
                        <MetLabel>Role:</MetLabel>
                    </Grid>
                    <Grid item xs={2}>
                        <MetParagraph sx={{ pl: 2 }}>
                            {savedUser && savedUser.roles
                                ? savedUser.roles.map((role, index) => (
                                    <React.Fragment key={index}>
                                        {role}
                                        {index < savedUser.roles.length - 1 ? ', ' : ''}
                                    </React.Fragment>
                                ))
                                : 'none'}
                        </MetParagraph>
                    </Grid>
                </Grid>

                <Grid container direction="row" item xs={6} spacing={1}>
                    <Grid item xs={1.5} sx={{ mr: 1 }}>
                        <MetLabel>Status:</MetLabel>
                    </Grid>
                    <Grid item xs={1.5}>
                        <MetParagraph sx={{ pl: 2 }}>{savedUser && savedUser?.email_id}</MetParagraph>
                    </Grid>
                </Grid>

                <Grid container direction="row" item xs={6} spacing={1}>
                    <Grid item xs={6}>
                        <FormControlLabel
                            control={<Switch checked={superUserAssigned} onChange={handleToggleChange} />}
                            label={<MetLabel>Assign Superuser Role</MetLabel>}
                        />
                    </Grid>
                </Grid>

                <Grid container direction="row" item xs={6} spacing={1}>
                    <Grid item xs={1.5} sx={{ mr: 1 }}>
                        <MetLabel>Date Added:</MetLabel>
                    </Grid>
                    <Grid item xs={4}>
                        <MetParagraph sx={{ pl: 2 }}>{savedUser && savedUser?.created_date}</MetParagraph>
                    </Grid>
                </Grid>

                <Grid container direction="row" item xs={6} spacing={1}>
                    <Grid item xs={6}>
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
                <MetTable
                    headCells={headCells}
                    rows={memberships}
                    handleChangePagination={(paginationOptions: PaginationOptions<EngagementTeamMember>) =>
                        setPaginationOptions(paginationOptions)
                    }
                    paginationOptions={paginationOptions}
                    loading={isUserLoading}
                    pageInfo={pageInfo}
                />
            </Grid>
        </MetPageGridContainer>
    );
};

export default UserDetails;
