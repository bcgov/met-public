import React from 'react';
import { Grid } from '@mui/material';
import { modalStyle, PrimaryButtonOld, MetHeader1Old, MetBodyOld } from 'components/common';
import { NotificationModalProps } from './types';

const UpdateModal = ({ header, subText, handleClose }: NotificationModalProps) => {
    return (
        <Grid
            container
            direction="row"
            justifyContent="flex-start"
            alignItems="space-between"
            sx={{ ...modalStyle }}
            rowSpacing={2}
        >
            <Grid container direction="row" item xs={12}>
                <Grid item xs={12}>
                    <MetHeader1Old bold sx={{ mb: 2 }}>
                        {header}
                    </MetHeader1Old>
                </Grid>
            </Grid>
            <Grid container direction="row" item xs={12}>
                {subText.map((subtext) => (
                    <Grid item xs={12}>
                        <MetBodyOld bold={subtext.bold} sx={{ mb: 1 }}>
                            {subtext.text}
                        </MetBodyOld>
                    </Grid>
                ))}
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

export default UpdateModal;
