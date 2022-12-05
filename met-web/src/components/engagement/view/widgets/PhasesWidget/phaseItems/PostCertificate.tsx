import React from 'react';
import { Grid } from '@mui/material';
import { MetHeader4, MetParagraph } from 'components/common';
import { PhaseBox } from '../PhaseBox';
import { ReadMoreBox } from '../ReadMoreBox';

export const PostCertificate = () => {
    return (
        <PhaseBox
            title="Post-Certificate"
            backgroundColor="#A6BB2E"
            readMoreBox={
                <ReadMoreBox backgroundColor="#EDF2D4" sx={{ border: '3px solid #A6BB2E', margin: 0 }}>
                    <Grid container direction="row" justifyContent="flex-start" alignItems="flex-start" spacing={2}>
                        <Grid item xs={12}>
                            <MetHeader4 bold>Post-Certificate</MetHeader4>
                        </Grid>
                        <Grid item xs={12}>
                            <MetParagraph>
                                Monitor project to make sure requirements are being followed. Projects not in compliance
                                are subject to enforcement measures, including fines.
                            </MetParagraph>
                        </Grid>
                        <Grid item xs={12}>
                            <MetParagraph>
                                Proponents may also seek amendments to the Certificate as permitting and construction
                                proceeds and operations get underway.
                            </MetParagraph>
                        </Grid>
                    </Grid>
                </ReadMoreBox>
            }
        />
    );
};
