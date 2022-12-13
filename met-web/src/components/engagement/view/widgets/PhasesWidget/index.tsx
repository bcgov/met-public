import React, { useContext, useState } from 'react';
import { Grid, Skeleton, Stack } from '@mui/material';
import { MetBody, MetHeader3, MetPaper } from 'components/common';
import { WidgetType } from 'models/widget';
import { ActionContext } from '../../ActionContext';
import { EngagementPhase } from './PhasesWidgetMobile/EngagementPhase';
import { ENGAGEMENT_PHASES } from 'models/engagementPhases';

interface PhaseContextProps {
    anchorEl: HTMLButtonElement | null;
    setAnchorEl: React.Dispatch<React.SetStateAction<HTMLButtonElement | null>>;
}

export const PhaseContext = React.createContext<PhaseContextProps>({
    anchorEl: null,
    setAnchorEl: () => {
        throw new Error('Not implemented');
    },
});
export const PhasesWidget = () => {
    const { widgets, isWidgetsLoading } = useContext(ActionContext);
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

    const phasesWidget = widgets.find((widget) => widget.widget_type_id === WidgetType.Phases);

    if (isWidgetsLoading) {
        return <Skeleton variant="rectangular" height={'20em'} />;
    }

    if (!phasesWidget) {
        return null;
    }

    return (
        <PhaseContext.Provider
            value={{
                anchorEl,
                setAnchorEl,
            }}
        >
            <MetPaper elevation={1} sx={{ padding: '2em' }}>
                <Grid container direction="row" justifyContent="flex-start" alignItems="flex-start" rowSpacing={2}>
                    <Grid item xs={12}>
                        <MetHeader3 bold>The EA Process</MetHeader3>
                    </Grid>
                    <Grid item xs={12}>
                        <MetBody>
                            Click on the sections below to expand them and learn more about each EA process phase. You
                            can also learn more about each engagement period by clicking the engagement icon.
                        </MetBody>
                    </Grid>
                    <Grid item xs={12} sx={{ maxWidth: '99%' }}>
                        <Stack direction="row" sx={{ overflowX: 'auto', overflowY: 'clip' }}>
                            <EngagementPhase
                                title={ENGAGEMENT_PHASES.EarlyEngagement.title}
                                backgroundColor={ENGAGEMENT_PHASES.EarlyEngagement.backgroundColor}
                                learnMoreBackgroundColor={ENGAGEMENT_PHASES.EarlyEngagement.learnMoreBackgroundColor}
                                learnMoreText={ENGAGEMENT_PHASES.EarlyEngagement.learnMoreText}
                                popOverText={ENGAGEMENT_PHASES.EarlyEngagement.popOverText}
                                mobile={true}
                            />
                            <EngagementPhase
                                title={ENGAGEMENT_PHASES.ReadinessDecision.title}
                                backgroundColor={ENGAGEMENT_PHASES.ReadinessDecision.backgroundColor}
                                learnMoreBackgroundColor={ENGAGEMENT_PHASES.ReadinessDecision.learnMoreBackgroundColor}
                                learnMoreText={ENGAGEMENT_PHASES.ReadinessDecision.learnMoreText}
                                popOverText={ENGAGEMENT_PHASES.ReadinessDecision.popOverText}
                                mobile={true}
                            />
                            <EngagementPhase
                                title={ENGAGEMENT_PHASES.ProcessPlanning.title}
                                backgroundColor={ENGAGEMENT_PHASES.ProcessPlanning.backgroundColor}
                                learnMoreBackgroundColor={ENGAGEMENT_PHASES.ProcessPlanning.learnMoreBackgroundColor}
                                learnMoreText={ENGAGEMENT_PHASES.ProcessPlanning.learnMoreText}
                                popOverText={ENGAGEMENT_PHASES.ProcessPlanning.popOverText}
                                mobile={true}
                            />
                            <EngagementPhase
                                title={ENGAGEMENT_PHASES.AppDevReview.title}
                                backgroundColor={ENGAGEMENT_PHASES.AppDevReview.backgroundColor}
                                learnMoreBackgroundColor={ENGAGEMENT_PHASES.AppDevReview.learnMoreBackgroundColor}
                                learnMoreText={ENGAGEMENT_PHASES.AppDevReview.learnMoreText}
                                popOverText={ENGAGEMENT_PHASES.AppDevReview.popOverText}
                                mobile={true}
                            />
                            <EngagementPhase
                                title={ENGAGEMENT_PHASES.EffectAssessmentReview.title}
                                backgroundColor={ENGAGEMENT_PHASES.EffectAssessmentReview.backgroundColor}
                                learnMoreBackgroundColor={
                                    ENGAGEMENT_PHASES.EffectAssessmentReview.learnMoreBackgroundColor
                                }
                                learnMoreText={ENGAGEMENT_PHASES.EffectAssessmentReview.learnMoreText}
                                popOverText={ENGAGEMENT_PHASES.EffectAssessmentReview.popOverText}
                                mobile={true}
                            />
                            <EngagementPhase
                                title={ENGAGEMENT_PHASES.Decision.title}
                                backgroundColor={ENGAGEMENT_PHASES.Decision.backgroundColor}
                                learnMoreBackgroundColor={ENGAGEMENT_PHASES.Decision.learnMoreBackgroundColor}
                                learnMoreText={ENGAGEMENT_PHASES.Decision.learnMoreText}
                                mobile={true}
                            />
                            <EngagementPhase
                                title={ENGAGEMENT_PHASES.PostCertificate.title}
                                backgroundColor={ENGAGEMENT_PHASES.PostCertificate.backgroundColor}
                                learnMoreBackgroundColor={ENGAGEMENT_PHASES.PostCertificate.learnMoreBackgroundColor}
                                learnMoreText={ENGAGEMENT_PHASES.PostCertificate.learnMoreText}
                                mobile={true}
                            />
                        </Stack>
                    </Grid>
                </Grid>
            </MetPaper>
        </PhaseContext.Provider>
    );
};
