import React from 'react';
import { Grid } from '@mui/material';
import { MetHeader4, MetParagraph } from 'components/common';
import { PhaseBox } from '../PhaseBox';
import { ReadMoreBox } from '../ReadMoreBox';

export const ProcessPlanning = () => {
    return (
        <PhaseBox
            title="Process Planning"
            backgroundColor="#043673"
            readMoreBox={
                <ReadMoreBox backgroundColor="#C8CAD6" sx={{ border: '3px solid #043673', margin: 0 }}>
                    <Grid container direction="row" justifyContent="flex-start" alignItems="flex-start" spacing={2}>
                        <Grid item xs={12}>
                            <MetHeader4 bold>Process Planning</MetHeader4>
                        </Grid>
                        <Grid item xs={12}>
                            <MetParagraph>
                                Engage with Indigenous nations, stakeholders, technical experts to establish how the
                                environmental assessment will be conducted, including scope, procedures and methods, and
                                how provincial and Indigenous processes and decision-making will align. Consensus with
                                Indigenous nations sought.
                            </MetParagraph>
                        </Grid>
                    </Grid>
                </ReadMoreBox>
            }
            iconBox={
                <MetParagraph>
                    Tell us what you think of the draft process order and assessment plan. Have we captured everything
                    that should be assessed and the information required? Are the timelines and assessment methods
                    appropriate? What do you think of how we plan to collect feedback from the public?
                </MetParagraph>
            }
        />
    );
};
