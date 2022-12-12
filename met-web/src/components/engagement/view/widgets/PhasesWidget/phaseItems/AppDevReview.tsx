import React from 'react';
import { Grid } from '@mui/material';
import { MetHeader4, MetParagraph } from 'components/common';
import { PhaseBox } from '../PhaseBox';
import { ReadMoreBox } from '../ReadMoreBox';
import { ProcessStageProps } from '../PhasesWidgetMobile/PhasesWidgetMobile';

export const AppDevReview = ({ mobile }: ProcessStageProps) => {
    return (
        <PhaseBox
            title="Application Development & Review"
            backgroundColor="#4D95D0"
            mobile={mobile}
            readMoreBox={
                <ReadMoreBox backgroundColor="#D7EBF8" sx={{ border: '3px solid #4D95D0', margin: 0 }}>
                    <Grid container direction="row" justifyContent="flex-start" alignItems="flex-start" spacing={2}>
                        <Grid item xs={12}>
                            <MetHeader4 bold>Application Development and Review</MetHeader4>
                        </Grid>
                        <Grid item xs={12}>
                            <MetParagraph>
                                Proponent consults and does technical studies, then develops Initial application. EAO
                                then seeks feedback on it from Indigenous nations, stakeholders, technical experts and
                                the public.
                            </MetParagraph>
                        </Grid>
                        <Grid item xs={12}>
                            <MetParagraph>
                                Proponent revises application, and submits to EAO for review. Consensus with Indigenous
                                nations sought.
                            </MetParagraph>
                        </Grid>
                        <Grid item xs={12}>
                            <MetParagraph sx={{ fontStyle: 'italic' }}>
                                Decision point: accept revised application or require further revisions.
                            </MetParagraph>
                        </Grid>
                    </Grid>
                </ReadMoreBox>
            }
            iconBox={
                <MetParagraph>
                    Tell us what you think about the proponent’s application. Are there effects that haven’t been fully
                    considered? Now that you have the proponent’s full assessment, is there anything new or is still
                    raising concerns for you? Do you think something has been assessed inaccurately?
                </MetParagraph>
            }
        />
    );
};
