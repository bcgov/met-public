import { Grid, Link, Stack } from '@mui/material';
import { MetBody, MetHeader3, MetHeader4, MetPaper, MetParagraph, MetSmallText } from 'components/common';
import { EngagementPhases } from 'models/engagementPhases';
import { WidgetType } from 'models/widget';
import React, { useContext, useState } from 'react';
import { ActionContext } from '../../ActionContext';
import { PhaseBox } from './PhaseBox';
import { AppDevReview } from './phaseItems/AppDevReview';
import { Decision } from './phaseItems/Decision';
import { EarlyEngagement } from './phaseItems/EarlyEngagement';
import { EffectAssessmentReview } from './phaseItems/EffectAssessmentRec';
import { PostCertificate } from './phaseItems/PostCertificate';
import { ProcessPlanning } from './phaseItems/ProcessPlanning';
import { ReadinessDecision } from './phaseItems/ReadinessDecision';
import { ReadMoreBox } from './ReadMoreBox';

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
    const { widgets } = useContext(ActionContext);
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

    const phasesWidget = widgets.find((widget) => widget.widget_type_id === WidgetType.Phases);
    const currentPhase = phasesWidget?.items[0]?.widget_data_id || EngagementPhases.Standalone;

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
                            <EarlyEngagement />
                            <ReadinessDecision />
                            <ProcessPlanning />
                            <AppDevReview />
                            <EffectAssessmentReview />
                            <Decision />
                            <PostCertificate />
                        </Stack>
                    </Grid>
                </Grid>
            </MetPaper>
        </PhaseContext.Provider>
    );
};
