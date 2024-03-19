import React, { useContext } from 'react';
import { Grid, Skeleton } from '@mui/material';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { CommentViewContext } from './CommentViewContext';
import { PrimaryButton, MetPaper, MetHeader4 } from 'components/common';
import CommentTable from './CommentTable';
import { useAppSelector, useAppDispatch } from 'hooks';
import { SubmissionStatus } from 'constants/engagementStatus';
import { openNotificationModal } from 'services/notificationModalService/notificationModalSlice';
import { useAppTranslation } from 'hooks';

interface CommentsBlockProps {
    dashboardType: string;
}

export const CommentsBlock: React.FC<CommentsBlockProps> = ({ dashboardType }) => {
    const { t: translate } = useAppTranslation();
    const { slug } = useParams();
    const { engagement, isEngagementLoading } = useContext(CommentViewContext);
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const canAccessDashboard = useAppSelector((state) => state.user.roles.includes('access_dashboard'));
    const isLoggedIn = useAppSelector((state) => state.user.authentication.authenticated);
    const languagePath = `/${sessionStorage.getItem('languageId')}`;
    const basePath = slug ? `/${slug}` : `/engagements/${engagement?.id}`;

    const handleViewDashboard = () => {
        /* check to ensure that users with role access_dashboard can access the dashboard while engagement not closed*/
        if (canAccessDashboard) {
            navigate(`/engagements/${engagement?.id}/dashboard/${dashboardType}`);
            return;
        }

        /* check to ensure that all other users can access the dashboard only after the engagement is closed*/
        if (engagement?.submission_status !== SubmissionStatus.Closed) {
            dispatch(
                openNotificationModal({
                    open: true,
                    data: {
                        header: translate('commentDashboard.block.notification.header'),
                        subText: [
                            {
                                text: translate('commentDashboard.block.notification.text'),
                            },
                        ],
                    },
                    type: 'update',
                }),
            );
            return;
        }

        if (isLoggedIn) {
            navigate(`${basePath}/dashboard/public`);
        } else {
            navigate(`${languagePath}${basePath}/dashboard/public`);
        }
    };

    if (isEngagementLoading || !engagement) {
        return <Skeleton width="100%" height="40em" />;
    }

    return (
        <>
            <Grid item xs={12} container direction="row" justifyContent="flex-end">
                <Link
                    to={isLoggedIn ? `${basePath}/view` : `${languagePath}${basePath}/view`}
                    style={{ color: '#1A5A96' }}
                >
                    {translate('commentDashboard.block.link.0') +
                        engagement.name +
                        translate('commentDashboard.block.link.1')}
                </Link>
            </Grid>
            <Grid item xs={12}>
                <MetPaper elevation={1} sx={{ padding: '2em 2em 0 2em' }}>
                    <Grid container direction="row" justifyContent="flex-start" alignItems="flex-start" rowSpacing={2}>
                        <Grid item xs={12} sm={6}>
                            <MetHeader4>{translate('commentDashboard.block.header')}</MetHeader4>
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
                                {translate('commentDashboard.block.buttonText')}
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
