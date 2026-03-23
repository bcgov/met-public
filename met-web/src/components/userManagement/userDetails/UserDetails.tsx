import React, { JSX, useContext } from 'react';
import { Grid2 as Grid, Link } from '@mui/material';
import { useAppSelector } from 'hooks';
import { UserDetailsContext } from './UserDetailsContext';
import { formatDate } from 'components/common/dateHelper';
import AssignedEngagementsListing from './AssignedEngagementsListing';
import UserStatusButton from './UserStatusButton';
import UserDetailsSkeleton from './UserDetailsSkeleton';
import { USER_COMPOSITE_ROLE, USER_STATUS } from 'models/user';
import { Button } from 'components/common/Input/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquareDashedCirclePlus } from '@fortawesome/pro-regular-svg-icons';
import { BodyText } from 'components/common/Typography/Body';
import { Header2 } from 'components/common/Typography';

export const UserDetail = ({ label, value }: { label: string; value: JSX.Element }) => {
    return (
        <Grid container spacing={1} size={12}>
            <Grid size="auto">
                <BodyText bold>{label}:</BodyText>
            </Grid>
            <Grid size="auto">{value}</Grid>
        </Grid>
    );
};

export const UserDetails = () => {
    const { savedUser, setAddUserModalOpen, isUserLoading } = useContext(UserDetailsContext);
    const { userDetail } = useAppSelector((state) => state.user);

    if (isUserLoading) {
        return <UserDetailsSkeleton />;
    }

    return (
        <>
            <Grid
                container
                spacing={2}
                size={12}
                direction={{ xs: 'column', md: 'row' }}
                justifyContent="space-between"
            >
                {/* User Information Section */}
                <Grid container spacing={1} size="grow">
                    <Grid container spacing={2} mt={2} mb={1} alignItems="center">
                        <Grid size="auto">
                            <Header2 decorated mb={0}>{`${savedUser?.last_name}, ${savedUser?.first_name}`}</Header2>
                        </Grid>
                        <Grid size="grow" minWidth="max-content">
                            <UserStatusButton />
                        </Grid>
                    </Grid>
                    <UserDetail
                        label="Email"
                        value={<Link href={`emailto:${savedUser?.email_address}`}>{savedUser?.email_address}</Link>}
                    />
                    <UserDetail
                        label="Date Added"
                        value={<BodyText>{savedUser ? formatDate(savedUser?.created_date) : ''}</BodyText>}
                    />
                    <UserDetail label="Role" value={<BodyText>{savedUser?.main_role}</BodyText>} />
                    <UserDetail
                        label="Status"
                        value={
                            <BodyText>
                                {savedUser?.status_id === USER_STATUS.ACTIVE.value
                                    ? USER_STATUS.ACTIVE.label
                                    : USER_STATUS.INACTIVE.label}
                            </BodyText>
                        }
                    />
                </Grid>

                {/* Actions Section */}
                <Grid
                    container
                    flexDirection="column"
                    spacing={1}
                    size="auto"
                    alignItems={{ xs: 'flex-start', md: 'flex-end' }}
                    justifyContent={{ xs: 'flex-start', md: 'flex-end' }}
                >
                    <Grid size="auto" minWidth="max-content">
                        <Button
                            variant="primary"
                            icon={<FontAwesomeIcon icon={faSquareDashedCirclePlus} />}
                            onClick={() => setAddUserModalOpen(true)}
                            disabled={
                                savedUser?.main_role === USER_COMPOSITE_ROLE.VIEWER.label ||
                                savedUser?.status_id === USER_STATUS.INACTIVE.value ||
                                savedUser?.id === userDetail?.user?.id
                            }
                        >
                            Add to an Engagement
                        </Button>
                    </Grid>
                </Grid>
            </Grid>

            {/* Assigned Engagements Table */}
            <Grid size={12} sx={{ mt: 3 }}>
                <AssignedEngagementsListing />
            </Grid>
        </>
    );
};

export default UserDetails;
