import React from 'react';
import { Grid } from '@mui/material';
import { MetHeader4, MetParagraph } from 'components/common';
import { PhaseBox } from '../PhaseBox';
import { ReadMoreBox } from '../ReadMoreBox';
import { ProcessStageProps } from 'models/engagementPhases';

export const EarlyEngagement = ({ mobile }: ProcessStageProps) => {
    return (
        <PhaseBox
            title="Early Engagement"
            backgroundColor="#54858D"
            mobile={mobile}
            readMoreBox={
                <ReadMoreBox backgroundColor="#D1D9DD" sx={{ border: '3px solid #54858D', margin: 0 }}>
                    <Grid container direction="row" justifyContent="flex-start" alignItems="flex-start" spacing={2}>
                        <Grid item xs={12}>
                            <MetHeader4 bold>Early Engagement</MetHeader4>
                        </Grid>
                        <Grid item xs={12}>
                            <MetParagraph>
                                Engage with Indigenous nations, stakeholders, technical experts and the public to
                                identify potential key issues early in the process, and ways they could be addressed.
                            </MetParagraph>
                        </Grid>
                    </Grid>
                </ReadMoreBox>
            }
            iconBox={
                <MetParagraph>
                    Tell us about your interests, issues and concerns about the initial proposal for the project. How
                    would the project as proposed personally affect you, your family, or your community? Tell us how you
                    want to provide feedback and be involved in the rest of the assessment process.
                </MetParagraph>
            }
        />
    );
};
