import React from 'react';
import { Grid } from '@mui/material';
import { MetHeader4, MetParagraph } from 'components/common';
import { PhaseBox } from '../PhaseBox';
import { ReadMoreBox } from '../ReadMoreBox';

export const Decision = () => {
    return (
        <PhaseBox
            title="Decision"
            backgroundColor="#6A54A3"
            readMoreBox={
                <ReadMoreBox backgroundColor="#D6D1E7" sx={{ border: '3px solid #6A54A3', margin: 0 }}>
                    <Grid container direction="row" justifyContent="flex-start" alignItems="flex-start" spacing={2}>
                        <Grid item xs={12}>
                            <MetHeader4 bold>Decision</MetHeader4>
                        </Grid>
                        <Grid item xs={12}>
                            <MetParagraph sx={{ fontStyle: 'italic' }}>
                                Decision point: Ministers determine whether or not project will receive an Environmental
                                Assessment Certificate, and if so, what conditions will be required to address potential
                                adverse effects.
                            </MetParagraph>
                        </Grid>
                    </Grid>
                </ReadMoreBox>
            }
        />
    );
};
