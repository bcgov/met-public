import React, { useContext } from 'react';
import { Button, Grid } from '@mui/material';
import { useAppSelector } from 'hooks';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router';
import { ActionContext } from '../../view/ActionContext';
import { EngagementBanner } from '../../view/EngagementBanner';
import { PreviewBanner } from '../../view/PreviewBanner';
import { SubmissionStatus } from 'constants/engagementStatus';
import { AppConfig } from 'config';

export const EngagementDashboard = () => {
    const isLoggedIn = useAppSelector((state) => state.user.authentication.authenticated);
    const isPreview = isLoggedIn;
    const { savedEngagement } = useContext(ActionContext);
    const navigate = useNavigate();
    const urlpath = AppConfig.redashDashboardUrl;
    const isOpen = savedEngagement.submission_status === SubmissionStatus.Open;

    const handleStartSurvey = () => {
        if (!isPreview) {
            return;
        }
    };

    const routeChange = () => {
        const path = `/engagement/dashboard/comment/` + savedEngagement.id;
        navigate(path);
    };

    return (
        <>
            <Grid container direction="row" justifyContent="flex-start" alignItems="flex-start">
                <Grid item xs={12}>
                    <PreviewBanner />
                </Grid>
                <Grid item xs={12}>
                    <EngagementBanner startSurvey={handleStartSurvey} />
                </Grid>
                <Grid
                    container
                    item
                    direction="row"
                    justifyContent={'flex-end'}
                    alignItems="flex-end"
                    m={{ lg: '1em 8em 0em 3em' }}
                >
                    <Link to={'/engagement/view/' + savedEngagement.id} style={{ color: '#1A5A96' }}>
                        {'<<Return to ' + savedEngagement.name + ' Engagement'}
                    </Link>
                </Grid>
                <Grid
                    container
                    item
                    direction="row"
                    justifyContent={'flex-start'}
                    alignItems="flex-start"
                    m={{ lg: '1em 8em 0em 3em' }}
                >
                    <h1>What we heard</h1>
                    {!isOpen && !isPreview ? (
                        <Button
                            data-testid="SurveyBlock/take-me-to-survey-button"
                            variant="contained"
                            style={{ marginLeft: 'auto' }}
                            onClick={routeChange}
                        >
                            Read Comments
                        </Button>
                    ) : null}
                    <p>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
                        labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
                        laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in
                        voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat
                        non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                    </p>
                </Grid>
                <Grid
                    container
                    item
                    xs={12}
                    direction="row"
                    justifyContent={'flex-start'}
                    alignItems="flex-start"
                    m={{ lg: '0em 8em 1em 3em' }}
                    rowSpacing={2}
                >
                    <iframe
                        style={{ width: '100%', height: 1310, overflow: 'visible' }}
                        src={urlpath + savedEngagement.name}
                    ></iframe>
                </Grid>
            </Grid>
        </>
    );
};

export default EngagementDashboard;
