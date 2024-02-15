import React, { useContext } from 'react';
import { Grid, Stack, Link } from '@mui/material';
import { useAppSelector } from 'hooks';
import { MetLabel, MetParagraph, MetPageGridContainer, PrimaryButton } from 'components/common';
import { UserDetailsContext } from './UserDetailsContext';
import { formatDate } from 'components/common/dateHelper';
import AssignedEngagementsListing from './AssignedEngagementsListing';
import UserStatusButton from './UserStatusButton';
import UserDetailsSkeleton from './UserDetailsSkeleton';
import { USER_COMPOSITE_ROLE, USER_STATUS } from 'models/user';

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
    const { userDetail } = useAppSelector((state) => state.user);

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
                                    <MetParagraph>{`${savedUser?.last_name}, ${savedUser?.first_name}`}</MetParagraph>
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
                            <UserDetail label="Role" value={<MetParagraph>{savedUser?.main_role}</MetParagraph>} />
                        </Grid>
                        <Grid item xs={12}>
                            <UserDetail
                                label="Status"
                                value={
                                    <MetParagraph>
                                        {savedUser?.status_id === USER_STATUS.ACTIVE.value
                                            ? USER_STATUS.ACTIVE.label
                                            : USER_STATUS.INACTIVE.label}
                                    </MetParagraph>
                                }
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
                        disabled={
                            savedUser?.main_role === USER_COMPOSITE_ROLE.VIEWER.label ||
                            savedUser?.status_id === USER_STATUS.INACTIVE.value ||
                            savedUser?.id === userDetail?.user?.id
                        }
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
