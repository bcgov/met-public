import React, { useContext, useState, useEffect } from 'react';
import { Grid } from '@mui/material';
import { EngagementBanner } from './EngagementBanner';
import { ActionContext } from './ActionContext';
import { EngagementContent } from './EngagementContent';
import SurveyBlock from './SurveyBlock';
import EmailModal from './EmailModal';
import { PreviewBanner } from './PreviewBanner';
import { useAppSelector } from 'hooks';
import { useNavigate, useLocation } from 'react-router';
import { EngagementViewProps } from './types';

export const EngagementView = ({ open }: EngagementViewProps) => {
    const [isEmailModalOpen, setEmailModalOpen] = useState(open ? open : false);
    const isLoggedIn = useAppSelector((state) => state.user.authentication.authenticated);
    const isPreview = isLoggedIn;
    const { savedEngagement } = useContext(ActionContext);
    const surveyId = savedEngagement.surveys[0]?.id || '';
    const navigate = useNavigate();

    useEffect(() => {
        console.log('');
    });

    const handleStartSurvey = () => {
        if (!isPreview) {
            setEmailModalOpen(true);
            return;
        }

        navigate(`/survey/submit/${surveyId}`);
    };

    return (
        <>
            <EmailModal open={isEmailModalOpen} handleClose={() => setEmailModalOpen(false)} />
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
                    xs={12}
                    direction="row"
                    justifyContent={'flex-start'}
                    alignItems="flex-start"
                    sx={{ margin: '1em 2em 1em 3em' }}
                    m={{ lg: '0 8em 1em 3em', md: '2em', xs: '1em' }}
                    spacing={2}
                >
                    <Grid item xs={12} lg={8}>
                        <EngagementContent />
                    </Grid>
                    <Grid item xs={12} lg={4}>
                        <WhoIsListeningWidget />
                    </Grid>
                    <Grid item xs={12} lg={8}>
                        <SurveyBlock startSurvey={handleStartSurvey} />
                    </Grid>
                </Grid>
            </Grid>
        </>
    );
};

export default EngagementView;
