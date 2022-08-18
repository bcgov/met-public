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
import WhoIsListeningWidget from './WhoIsListeningWidget';
import { RouteState, defaultPanelData } from './types';

export const EngagementView = () => {
    const { state } = useLocation() as RouteState;
    const [isEmailModalOpen, setEmailModalOpen] = useState(state ? state.open : false);
    const [panelData, setPanelData] = useState({
        mainText: state ? state.mainText : defaultPanelData.mainText,
        subTextArray: state ? state.subTextArray : defaultPanelData.subTextArray,
        email: state ? state.email : defaultPanelData.email,
        defaultPanel: state ? 'success' : 'email',
    });
    const isLoggedIn = useAppSelector((state) => state.user.authentication.authenticated);
    const isPreview = isLoggedIn;
    const { savedEngagement } = useContext(ActionContext);
    const surveyId = savedEngagement.surveys[0]?.id || '';
    const navigate = useNavigate();

    //Clear state on window refresh
    window.history.replaceState({}, document.title);

    const handleStartSurvey = () => {
        if (!isPreview) {
            setEmailModalOpen(true);
            return;
        }

        navigate(`/survey/submit/${surveyId}`);
    };

    useEffect(() => {
        if (isEmailModalOpen === false) {
            setPanelData({
                mainText: defaultPanelData.mainText,
                subTextArray: defaultPanelData.subTextArray,
                email: defaultPanelData.email,
                defaultPanel: 'email',
            });
        }
    }, [isEmailModalOpen]);

    return (
        <>
            <EmailModal
                panelData={{
                    mainText: panelData.mainText,
                    subTextArray: panelData.subTextArray,
                    email: panelData.email,
                }}
                defaultPanel={panelData.defaultPanel}
                open={isEmailModalOpen}
                handleClose={() => setEmailModalOpen(false)}
            />
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
