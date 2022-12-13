import React from 'react';
import { Grid } from '@mui/material';
import { MetHeader4, MetParagraph } from 'components/common';
import { PhaseBoxMobile } from '../PhaseBoxMobile';
import { ReadMoreBox } from '../ReadMoreBox';
import { ProcessStageProps } from 'models/engagementPhases';

export const EngagementPhaseMobile = ({
    backgroundColor,
    learnMoreBackgroundColor,
    title,
    learnMoreText,
    popOverText,
    accordionBackground,
}: ProcessStageProps) => {
    return (
        <PhaseBoxMobile
            title={title}
            backgroundColor={backgroundColor}
            readMoreBox={
                <ReadMoreBox backgroundColor={accordionBackground} sx={{ p: 0, margin: 0 }}>
                    <Grid
                        sx={{ color: 'black' }}
                        container
                        direction="row"
                        justifyContent="flex-start"
                        alignItems="flex-start"
                        spacing={1}
                    >
                        <Grid item xs={12}>
                            <MetHeader4 sx={{ color: 'black' }} bold>
                                {title}
                            </MetHeader4>
                        </Grid>
                        {learnMoreText}
                    </Grid>
                </ReadMoreBox>
            }
            accordionBackground={accordionBackground}
            iconBox={popOverText ? <MetParagraph>{popOverText}</MetParagraph> : false}
        />
    );
};
