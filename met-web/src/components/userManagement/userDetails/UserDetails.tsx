import React, { useContext, useState } from 'react';
import { Grid, Stack, Link } from '@mui/material';
import { MetLabel, MetParagraph, MetPageGridContainer, PrimaryButton } from 'components/common';
import { useAppSelector, useAppDispatch } from 'hooks';
import { UserDetailsContext } from './UserDetailsContext';
import { formatDate } from 'components/common/dateHelper';
import AssignedEngagementsListing from './AssignedEngagementsListing';
import UserStatusButton from './UserStatusButton';
import UserDetailsSkeleton from './UserDetailsSkeleton';
import { USER_GROUP } from 'models/user';

export const UserDetail = ({ label, value }: { label: string; value: JSX.Element }) => {
    return (
        <Stack spacing={2} direction="row">
            <MetLabel>{label}:</MetLabel>
            {value}
        </Stack>
    );
};

export const UserDetails = () => {
    const { savedUser, setAddUserModalOpen, isUserLoading } = useContext(UserDetailsContext);

    if (isUserLoading) {
        return <UserDetailsSkeleton />;
    }

    return (
        <MetPageGridContainer>
            <Grid container direction="row" sx={{ mb: 4 }} item xs={12}>
                <Stack
                    direction={{ md: 'row', sm: 'column', xs: 'column' }}
                    width={'100%'}
                    justifyContent={'flex-start'}
                    spacing={1}
                >
                    <Grid container rowSpacing={1}>
                        <Grid item xs={12}>
                            <UserDetail
                                label="Name"
                                value={
                                    <MetParagraph>
                                        {savedUser?.first_name} {savedUser?.last_name}
                                    </MetParagraph>
                                }
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <UserDetail
                                label="Email"
                                value={
                                    <Link href={`emailto:${savedUser?.email_address}`}>{savedUser?.email_address}</Link>
                                }
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <UserDetail
                                label="Date Added"
                                value={
                                    <MetParagraph>{savedUser ? formatDate(savedUser?.created_date) : ''}</MetParagraph>
                                }
                            />
                        </Grid>
                    </Grid>

                    <Grid container>
                        <Grid item xs={12}>
                            <UserDetail
                                label="Current Role"
                                value={<MetParagraph>{savedUser?.main_group}</MetParagraph>}
                            />
                        </Grid>
                    </Grid>

                    <Grid item xs="auto">
                        <UserStatusButton />
                    </Grid>
                </Stack>
            </Grid>

            <Grid container item justifyContent={'flex-end'} alignItems={'flex-end'} xs={12}>
                <Grid item xs={6}></Grid>
                <Grid container justifyContent={'flex-end'} alignItems={'flex-end'} item xs={6}>
                    <PrimaryButton
                        onClick={() => setAddUserModalOpen(true)}
                        disabled={savedUser?.main_group === USER_GROUP.VIEWER.label}
                    >
                        + Add to an Engagement
                    </PrimaryButton>
                </Grid>
            </Grid>
            <Grid item xs={12}>
                <AssignedEngagementsListing />
            </Grid>
        </MetPageGridContainer>
    );
};

export default UserDetails;
