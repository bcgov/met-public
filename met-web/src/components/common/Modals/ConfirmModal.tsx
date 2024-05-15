import React from 'react';
import { Grid, Stack, useMediaQuery, Theme } from '@mui/material';
import { modalStyle, PrimaryButtonOld, SecondaryButtonOld, MetHeader1Old, MetBodyOld } from 'components/common';
import { NotificationModalProps } from './types';

const ConfirmModal = ({
    header,
    subText,
    handleConfirm,
    handleClose,
    confirmButtonText,
    cancelButtonText,
}: NotificationModalProps) => {
    const isSmallScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));

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
                {subText.map((subtext, index) => (
                    <Grid key={index} item xs={12}>
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
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} width="100%" justifyContent="flex-end">
                        {isSmallScreen ? (
                            <>
                                <PrimaryButtonOld onClick={handleConfirm} type="submit" variant={'contained'}>
                                    {confirmButtonText ? confirmButtonText : 'Confirm'}
                                </PrimaryButtonOld>
                                <SecondaryButtonOld onClick={handleClose}>
                                    {cancelButtonText ? cancelButtonText : 'Cancel'}
                                </SecondaryButtonOld>
                            </>
                        ) : (
                            <>
                                <SecondaryButtonOld onClick={handleClose}>
                                    {cancelButtonText ? cancelButtonText : 'Cancel'}
                                </SecondaryButtonOld>
                                <PrimaryButtonOld onClick={handleConfirm} type="submit" variant={'contained'}>
                                    {confirmButtonText ? confirmButtonText : 'Confirm'}
                                </PrimaryButtonOld>
                            </>
                        )}
                    </Stack>
                </Grid>
            </Grid>
        </Grid>
    );
};

export default ConfirmModal;
