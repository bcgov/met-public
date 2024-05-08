import React, { useContext, useEffect, useState } from 'react';
import { Grid, useMediaQuery, Theme } from '@mui/material';
import { ActionContext } from './ActionContext';
import { LanguageContext } from 'components/common/LanguageContext';
import { EngagementContent } from './EngagementContent';
import SurveyBlock from './SurveyBlock';
import EmailModal from './EmailModal';
import { PreviewBanner } from './PreviewBanner';
import { useAppSelector } from 'hooks';
import { useNavigate, useLocation } from 'react-router';
import { RouteState } from './types';
import WidgetBlock from './widgets/WidgetBlock';
import { Else, If, Then } from 'react-if';
import { getAvailableTranslationLanguages } from 'services/engagementService';
import { PhasesWidget } from './widgets/PhasesWidget';
import { PhasesWidgetMobile } from './widgets/PhasesWidget/PhasesWidgetMobile/PhasesWidgetMobile';
import { EngagementBanner } from './EngagementBanner';

export const EngagementView = () => {
    const { state } = useLocation() as RouteState;
    const [isEmailModalOpen, setEmailModalOpen] = useState(state ? state.open : false);
    const [defaultPanel, setDefaultPanel] = useState(state ? 'thank you' : 'email');
    const isLoggedIn = useAppSelector((state) => state.user.authentication.authenticated);
    const isPreview = isLoggedIn;
    const { savedEngagement } = useContext(ActionContext);
    const { setEngagementViewMounted, setAvailableEngagementTranslations } = useContext(LanguageContext);
    const [test, setTest] = useState(false);
    const surveyId = savedEngagement.surveys[0]?.id || '';
    const isSmallScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));
    const navigate = useNavigate();
    //Clear state on window refresh
    window.history.replaceState({}, document.title);

    const isMediumScreen: boolean = useMediaQuery((theme: Theme) => theme.breakpoints.up('md'));

    useEffect(() => {
        setEngagementViewMounted(true);
        return () => setEngagementViewMounted(false);
    }, []);

    useEffect(() => {
        if (savedEngagement?.id) {
            fetchAvailableEngagementTranslations(savedEngagement.id);
        }
    }, [savedEngagement]);

    const fetchAvailableEngagementTranslations = async (engagementId: number) => {
        try {
            const result = await getAvailableTranslationLanguages(engagementId);
            setAvailableEngagementTranslations(result);
        } catch (error) {
            setAvailableEngagementTranslations([]);
        }
    };

    const handleStartSurvey = () => {
        if (!isPreview) {
            setDefaultPanel('email');
            setEmailModalOpen(true);
            window.snowplow('trackPageView', 'Verify Email Modal');
            return;
        }

        navigate(`/surveys/${surveyId}/submit`);
    };

    const handleClose = () => {
        setEmailModalOpen(false);
        setDefaultPanel('email');
    };

    return (
        <>
            <EmailModal defaultPanel={defaultPanel} open={isEmailModalOpen} handleClose={() => handleClose()} />
            <Grid container direction="row" justifyContent="flex-start" alignItems="flex-start">
                <Grid item xs={12}>
                    <PreviewBanner />
                </Grid>
                <Grid item xs={12}>
                    <EngagementBanner />
                </Grid>
                <Grid
                    container
                    item
                    xs={12}
                    direction="row"
                    justifyContent={'flex-start'}
                    alignItems="flex-start"
                    m={{ md: '1em', xs: '1em' }}
                    rowSpacing={2}
                    columnSpacing={1}
                >
                    <Grid item xs={12}>
                        <If condition={isSmallScreen}>
                            <Then>
                                <PhasesWidgetMobile />
                            </Then>
                            <Else>
                                <PhasesWidget />
                            </Else>
                        </If>
                    </Grid>
                    <If condition={isMediumScreen}>
                        <Then>
                            <Grid
                                container
                                item
                                xs={12}
                                lg={8}
                                direction="row"
                                justifyContent={'flex-start'}
                                alignItems="flex-start"
                                rowSpacing={2}
                                columnSpacing={1}
                            >
                                <Grid data-testid={'engagement-content'} item xs={12}>
                                    <EngagementContent />
                                </Grid>
                                <If condition={surveyId !== ''}>
                                    <Then>
                                        <Grid item xs={12}>
                                            <SurveyBlock startSurvey={handleStartSurvey} />
                                        </Grid>
                                    </Then>
                                </If>
                            </Grid>
                            <Grid item data-testid={'widget-block'} xs={12} lg={4}>
                                <WidgetBlock />
                            </Grid>
                        </Then>
                        <Else>
                            <Grid data-testid={'engagement-content'} item xs={12}>
                                <EngagementContent />
                            </Grid>
                            <Grid item data-testid={'widget-block'} xs={12}>
                                <WidgetBlock />
                            </Grid>
                            <If condition={surveyId !== ''}>
                                <Then>
                                    <Grid item xs={12}>
                                        <SurveyBlock startSurvey={handleStartSurvey} />
                                    </Grid>
                                </Then>
                            </If>
                        </Else>
                    </If>
                </Grid>
            </Grid>
        </>
    );
};

export default EngagementView;
