import { Grid } from '@mui/material';
import { MetHeader4, MetParagraph } from 'components/common';
import React from 'react';
import { PhaseBox } from '../PhaseBox';
import { ReadMoreBox } from '../ReadMoreBox';

export const ReadinessDecision = () => {
    return (
        <PhaseBox
            title="Readiness Decision"
            backgroundColor="#DA6D65"
            readMoreBox={
                <ReadMoreBox backgroundColor="#FCE5E4">
                    <Grid container direction="row" justifyContent="flex-start" alignItems="flex-start" spacing={2}>
                        <Grid item xs={12}>
                            <MetHeader4 bold>Readiness Decision</MetHeader4>
                        </Grid>
                        <Grid item xs={12}>
                            <MetParagraph>
                                Review detailed project description, and input from early engagement and technical
                                advisors, to determine whether to proceed to environmental assessment. Consensus with
                                Indigenous nations sought.
                            </MetParagraph>
                        </Grid>
                        <Grid item xs={12}>
                            <MetParagraph>
                                Decision point: EAO can recommend project proceed to assessment, be exempted or
                                terminated from the process.
                            </MetParagraph>
                        </Grid>
                    </Grid>
                </ReadMoreBox>
            }
        />
    );
};
