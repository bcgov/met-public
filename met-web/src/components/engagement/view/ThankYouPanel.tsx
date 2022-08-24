import React, { useContext } from 'react';
import { Grid, Typography } from '@mui/material';
import { modalStyle, PrimaryButton } from 'components/common';
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
                    <Typography variant="h4" component="h2" sx={{ fontWeight: 'bold', mb: 2 }}>
                        Thank you
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    <Typography id="modal-modal-header"></Typography>
                </Grid>
            </Grid>
            <Grid container direction="row" item xs={12}>
                <Grid item xs={12}>
                    <Typography sx={{ mb: 1 }}>Your submission was successful.</Typography>
                </Grid>
                <Grid item xs={12}>
                    <Typography sx={{ mb: 1 }}>
                        We appreciate you take the time to voice your opinion about {savedEngagement.name}. When the
                        engagement period is over ({savedEngagement.end_date}), you will receive a link to access the
                        full survey report and view all the comments we received.
                    </Typography>
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
                    <PrimaryButton onClick={handleClose} sx={{ m: 1 }}>
                        Close
                    </PrimaryButton>
                </Grid>
            </Grid>
        </Grid>
    );
};

export default ThankYouPanel;
