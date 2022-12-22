import React, { useContext } from 'react';
import { Grid } from '@mui/material';
import { MetHeader4, MetParagraph } from 'components/common';
import { LearnMoreBox } from './LearnMoreBox';
import { EngagementPhases, PAST_PHASE, ProcessStageProps } from 'models/engagementPhases';
import { PhaseBox } from './PhaseBox';
import { ActionContext } from '../../ActionContext';
import { WidgetType } from 'models/widget';

export const EngagementPhase = ({
    backgroundColor,
    learnMoreBackgroundColor,
    title,
    learnMoreText,
    popOverText,
    phaseId,
}: ProcessStageProps) => {
    const { widgets } = useContext(ActionContext);
    const phasesWidget = widgets.find((widget) => widget.widget_type_id === WidgetType.Phases);
    const currentPhase = phasesWidget?.items[0]?.widget_data_id || EngagementPhases.Standalone;
    const isCurrent = phaseId >= currentPhase;

    return (
        <PhaseBox
            title={title}
            backgroundColor={isCurrent ? backgroundColor : PAST_PHASE.backgroundColor}
            sx={{ borderRight: isCurrent ? 'none' : `1px solid ${PAST_PHASE.borderColor}` }}
            learnMoreBox={
                <LearnMoreBox
                    backgroundColor={isCurrent ? learnMoreBackgroundColor : PAST_PHASE.learnMoreBackgroundColor}
                    sx={[
                        { margin: 0 },
                        isCurrent && { border: `3px solid ${backgroundColor}` },
                        !isCurrent && {
                            border: `3px solid ${PAST_PHASE.borderColor}`,
                        },
                    ]}
                >
                    <Grid container direction="row" justifyContent="flex-start" alignItems="flex-start" spacing={2}>
                        <Grid item xs={12}>
                            <MetHeader4 bold>{title}</MetHeader4>
                        </Grid>
                        {learnMoreText}
                    </Grid>
                </LearnMoreBox>
            }
            iconBox={popOverText ? <MetParagraph>{popOverText}</MetParagraph> : false}
            isCurrentPhase={phaseId === currentPhase}
            currentPhase={currentPhase}
        />
    );
};
