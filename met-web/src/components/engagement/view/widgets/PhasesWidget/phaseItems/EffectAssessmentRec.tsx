import React from 'react';
import { Grid } from '@mui/material';
import { MetHeader4, MetParagraph } from 'components/common';
import { PhaseBox } from '../PhaseBox';
import { ReadMoreBox } from '../ReadMoreBox';
import { ProcessStageProps } from '../PhasesWidgetMobile';

export const EffectAssessmentReview = ({ mobile }: ProcessStageProps) => {
    return (
        <PhaseBox
            title="Effect Assessment & Review"
            backgroundColor="#E7A913"
            mobile={mobile}
            readMoreBox={
                <ReadMoreBox backgroundColor="#FAEACC" sx={{ border: '3px solid #E7A913', margin: 0 }}>
                    <Grid container direction="row" justifyContent="flex-start" alignItems="flex-start" spacing={2}>
                        <Grid item xs={12}>
                            <MetHeader4 bold>Effect Assessment & Review</MetHeader4>
                        </Grid>
                        <Grid item xs={12}>
                            <MetParagraph>
                                Assess potential effects of the project. Develop assessment report and draft conditions
                                to address potential adverse effects, in consultation with technical experts and
                                Indigenous nations. Seek and incorporate feedback from Indigenous nations, stakeholders,
                                technical experts and the public. Consensus with Indigenous nations sought.
                            </MetParagraph>
                        </Grid>
                        <Grid item xs={12}>
                            <MetParagraph sx={{ fontStyle: 'italic' }}>
                                Decision point: recommend to ministers whether or not to issue an Environmental
                                Assessment Certificate.
                            </MetParagraph>
                        </Grid>
                    </Grid>
                </ReadMoreBox>
            }
            iconBox={
                <MetParagraph>
                    Tell us what you think about the package of draft decision materials that will be provided to
                    Ministers, who will decide whether or not to issue an environmental assessment certificate. Is
                    anything missing? Has something been assessed incorrectly? What should the ministers consider that
                    isn’t already included?
                </MetParagraph>
            }
        />
    );
};
