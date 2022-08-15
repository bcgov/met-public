import React from 'react';
import { Grid, Typography } from '@mui/material';
import { SuccessPanelProps } from './types';
import { modalStyle, PrimaryButton } from 'components/common';

const SuccessPanel = ({ mainText, subTextArray, email, handleClose }: SuccessPanelProps) => {
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
                    <Typography id="modal-modal-header">{mainText}</Typography>
                    <Typography sx={{ mt: 1 }}>{email}</Typography>
                </Grid>
            </Grid>
            <Grid container direction="row" item xs={12}>
                {subTextArray.map(function (subText) {
                    return (
                        <Grid item xs={12}>
                            <Typography sx={{ mb: 1, fontWeight: 'bold' }}>{subText}</Typography>
                        </Grid>
                    );
                })}

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

export default SuccessPanel;
