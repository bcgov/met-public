import React from 'react';
import { Grid } from '@mui/material';
import { MetHeader4, MetParagraph } from 'components/common';
import { PhaseBox } from '../PhaseBox';
import { ReadMoreBox } from '../ReadMoreBox';
import { ProcessStageProps } from './PhasesWidgetMobile';

export const EngagementPhase = ({
    mobile,
    backgroundColor,
    learnMoreBackgroundColor,
    title,
    learnMoreText,
    popOverText,
}: ProcessStageProps) => {
    return (
        <PhaseBox
            title={title}
            backgroundColor={backgroundColor}
            mobile={mobile}
            readMoreBox={
                <ReadMoreBox backgroundColor={learnMoreBackgroundColor} sx={{ border: '3px solid #54858D', margin: 0 }}>
                    <Grid container direction="row" justifyContent="flex-start" alignItems="flex-start" spacing={2}>
                        <Grid item xs={12}>
                            <MetHeader4 bold>{title}</MetHeader4>
                        </Grid>
                        {learnMoreText}
                    </Grid>
                </ReadMoreBox>
            }
            iconBox={popOverText ? <MetParagraph>{popOverText}</MetParagraph> : <></>}
        />
    );
};
