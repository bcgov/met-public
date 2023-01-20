import React, { useContext } from 'react';
import { Grid, Skeleton } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { CommentViewContext } from './CommentViewContext';
import { PrimaryButton, MetPaper, MetHeader4 } from 'components/common';
import CommentTable from './CommentTable';
import { useAppSelector, useAppDispatch } from 'hooks';
import { SubmissionStatus } from 'constants/engagementStatus';
import { openNotificationModal } from 'services/notificationModalService/notificationModalSlice';

export const CommentsBlock = () => {
    const { engagement, isEngagementLoading } = useContext(CommentViewContext);
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const roles = useAppSelector((state) => state.user.roles);

    const handleViewDashboard = () => {
        if (roles.length !== 0) {
            navigate(`/engagements/${engagement?.id}/dashboard`);
            return;
        }

        if (engagement?.submission_status === SubmissionStatus.Closed) {
            navigate(`/engagements/${engagement.id}/dashboard`);
            return;
        }

        dispatch(
            openNotificationModal({
                open: true,
                data: {
                    header: 'View Report',
                    subText: [
                        {
                            text: 'The report will only be available to view after the engagement period is over and the engagement is closed.',
                        },
                    ],
                },
                type: 'update',
            }),
        );
    };

    if (isEngagementLoading || !engagement) {
        return <Skeleton width="100%" height="40em" />;
    }

    return (
        <>
            <Grid item xs={12} container direction="row" justifyContent="flex-end">
                <Link to={`/engagements/${engagement.id}/view`} style={{ color: '#1A5A96' }}>
                    {'<<Return to ' + engagement.name + ' Engagement'}
                </Link>
            </Grid>
            <Grid item xs={12}>
                <MetPaper elevation={1} sx={{ padding: '2em 2em 0 2em' }}>
                    <Grid container direction="row" justifyContent="flex-start" alignItems="flex-start" rowSpacing={2}>
                        <Grid item xs={12} sm={6}>
                            <MetHeader4>Comments</MetHeader4>
                        </Grid>
                        <Grid
                            item
                            xs={12}
                            sm={6}
                            container
                            direction={{ xs: 'column', sm: 'row' }}
                            justifyContent="flex-end"
                        >
                            <PrimaryButton
                                data-testid="SurveyBlock/take-me-to-survey-button"
                                onClick={handleViewDashboard}
                            >
                                View Report
                            </PrimaryButton>
                        </Grid>
                        <Grid item xs={12}>
                            <CommentTable />
                        </Grid>
                    </Grid>
                </MetPaper>
            </Grid>
        </>
    );
};

export default CommentsBlock;
