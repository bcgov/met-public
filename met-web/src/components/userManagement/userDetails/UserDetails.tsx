import React, { useContext, useState } from 'react';
import { Grid, FormControlLabel, Switch } from '@mui/material';
import { MetLabel, MetParagraph, MetPageGridContainer, PrimaryButton } from 'components/common';
import { useAppSelector, useAppDispatch } from 'hooks';
import { UserDetailsContext } from './UserDetailsContext';
import { openNotificationModal } from 'services/notificationModalService/notificationModalSlice';
import { openNotification } from 'services/notificationService/notificationSlice';
import { formatDate } from 'components/common/dateHelper';
import AssignedEngagementsListing from './AssignedEngagementsListing';
import UserStatusToggle from './UserStatusToggle';

export const UserDetails = () => {
    const { roles } = useAppSelector((state) => state.user);
    const { savedUser, setAddUserModalOpen } = useContext(UserDetailsContext);
    const [superUserAssigned, setSuperUser] = useState(false);
    const dispatch = useAppDispatch();

    const handleToggleChange = () => {
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
                        <MetParagraph sx={{ pl: 2 }}>{savedUser?.main_group}</MetParagraph>
                    </Grid>
                </Grid>

                <Grid container direction="row" item xs={6} spacing={1}>
                    <Grid item xs={2.5} sx={{ mr: 1 }}>
                        <MetLabel>Email:</MetLabel>
                    </Grid>
                    <Grid item xs={1.5}>
                        <MetParagraph sx={{ pl: 2 }}>{savedUser?.email_address}</MetParagraph>
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
                    <Grid item xs={2.5} sx={{ mr: 1 }}>
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
                        <UserStatusToggle />
                    </Grid>
                </Grid>
            </Grid>
            <Grid container item justifyContent={'flex-end'} alignItems={'flex-end'} xs={12}>
                <Grid item xs={6}></Grid>
                <Grid container justifyContent={'flex-end'} alignItems={'flex-end'} item xs={6}>
                    <PrimaryButton onClick={() => setAddUserModalOpen(true)}>+ Add to an Engagement</PrimaryButton>
                </Grid>
            </Grid>
            <Grid item xs={12}>
                <AssignedEngagementsListing />
            </Grid>
        </MetPageGridContainer>
    );
};

export default UserDetails;
