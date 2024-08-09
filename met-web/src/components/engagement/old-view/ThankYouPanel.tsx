import React, { useContext } from 'react';
import { Grid, Typography } from '@mui/material';
import { modalStyle, PrimaryButtonOld, MetHeader1Old, MetBodyOld } from 'components/common';
import { ThankYouPanelProps } from './types';
import { ActionContext } from './ActionContext';

const ThankYouPanel = ({ handleClose }: ThankYouPanelProps) => {
    const { savedEngagement } = useContext(ActionContext);
    return (
        <Grid
            container
            direction="row"
            justifyContent="flex-start"
            alignItems="space-between"
            sx={{ ...modalStyle }}
            rowSpacing={2}
        >
            <Grid container item xs={12}>
                <Grid item xs={12}>
                    <MetHeader1Old bold sx={{ mb: 2 }}>
                        Thank you
                    </MetHeader1Old>
                </Grid>
                <Grid item xs={12}>
                    <Typography id="modal-modal-header"></Typography>
                </Grid>
            </Grid>
            <Grid container direction="row" item xs={12}>
                <Grid item xs={12}>
                    <MetBodyOld sx={{ mb: 1 }}>Your submission was successful.</MetBodyOld>
                </Grid>
                <Grid item xs={12}>
                    <MetBodyOld sx={{ mb: 1 }}>
                        We appreciate you take the time to voice your opinion about {savedEngagement.name}. When the
                        engagement period is over ({savedEngagement.end_date}), you will receive a link to access the
                        full survey report and view all the comments we received.
                    </MetBodyOld>
                </Grid>

                <Grid
                    item
                    container
                    direction={{ xs: 'column', sm: 'row' }}
                    xs={12}
                    justifyContent="flex-end"
                    spacing={1}
                    sx={{ mt: '1em' }}
                >
                    <PrimaryButtonOld onClick={handleClose} sx={{ m: 1 }}>
                        Close
                    </PrimaryButtonOld>
                </Grid>
            </Grid>
        </Grid>
    );
};

export default ThankYouPanel;
