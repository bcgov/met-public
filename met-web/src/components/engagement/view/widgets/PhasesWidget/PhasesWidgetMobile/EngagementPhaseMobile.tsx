import React, { useContext } from 'react';
import { Grid } from '@mui/material';
import { MetHeader4, MetParagraph } from 'components/common';
import { EngagementPhases, PAST_PHASE, ProcessStageProps } from 'models/engagementPhases';
import { PhaseBoxMobile } from './PhaseBoxMobile';
import { LearnMoreBox } from '../LearnMoreBox';
import { ActionContext } from 'components/engagement/view/ActionContext';
import { Widget, WidgetType } from 'models/widget';

export const EngagementPhaseMobile = ({
    backgroundColor,
    title,
    learnMoreText,
    popOverText,
    accordionBackground,
    phaseId,
}: ProcessStageProps) => {
    const { widgets } = useContext(ActionContext);
    const phasesWidget = widgets.find((widget: Widget) => widget.widget_type_id === WidgetType.Phases);
    const currentPhase = phasesWidget?.items[0]?.widget_data_id || EngagementPhases.Standalone;
    const isCurrent = phaseId >= currentPhase;

    return (
        <PhaseBoxMobile
            title={title}
            backgroundColor={isCurrent ? backgroundColor : PAST_PHASE.backgroundColor}
            learnMoreBox={
                <LearnMoreBox
                    backgroundColor={isCurrent ? accordionBackground : PAST_PHASE.learnMoreBackgroundColor}
                    sx={{ p: 0, margin: 0, color: '#494949' }}
                >
                    <Grid container direction="row" justifyContent="flex-start" alignItems="flex-start" spacing={1}>
                        <Grid item xs={12}>
                            <MetHeader4 bold>{title}</MetHeader4>
                        </Grid>
                        {learnMoreText}
                    </Grid>
                </LearnMoreBox>
            }
            accordionBackground={isCurrent ? accordionBackground : PAST_PHASE.learnMoreBackgroundColor}
            iconBox={popOverText ? <MetParagraph>{popOverText}</MetParagraph> : false}
            isCurrentPhase={phaseId === currentPhase}
            currentPhase={currentPhase}
        />
    );
};
