import React from 'react';
import { Grid } from '@mui/material';
import { modalStyle, PrimaryButton, MetHeader1, MetBody } from 'components/common';
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
                    <MetHeader1 bold={true} sx={{ mb: 2 }}>
                        {header}
                    </MetHeader1>
                </Grid>
            </Grid>
            <Grid container direction="row" item xs={12}>
                {subText.map((text: string) => (
                    <Grid item xs={12}>
                        <MetBody sx={{ mb: 1 }}> {text} </MetBody>
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
                    <PrimaryButton onClick={handleClose} sx={{ m: 1 }}>
                        Close
                    </PrimaryButton>
                </Grid>
            </Grid>
        </Grid>
    );
};

export default UpdateModal;
