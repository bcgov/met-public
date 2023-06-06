import React from 'react';
import { Grid, Stack, useMediaQuery, Theme } from '@mui/material';
import { modalStyle, PrimaryButton, SecondaryButton, MetHeader1, MetBody } from 'components/common';
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
                    <MetHeader1 bold sx={{ mb: 2 }}>
                        {header}
                    </MetHeader1>
                </Grid>
            </Grid>
            <Grid container direction="row" item xs={12}>
                {subText.map((subtext, index) => (
                    <Grid key={index} item xs={12}>
                        <MetBody bold={subtext.bold} sx={{ mb: 1 }}>
                            {subtext.text}
                        </MetBody>
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
                                <PrimaryButton onClick={handleConfirm} type="submit" variant={'contained'}>
                                    {confirmButtonText ? confirmButtonText : 'Confirm'}
                                </PrimaryButton>
                                <SecondaryButton onClick={handleClose}>
                                    {cancelButtonText ? cancelButtonText : 'Cancel'}
                                </SecondaryButton>
                            </>
                        ) : (
                            <>
                                <SecondaryButton onClick={handleClose}>
                                    {cancelButtonText ? cancelButtonText : 'Cancel'}
                                </SecondaryButton>
                                <PrimaryButton onClick={handleConfirm} type="submit" variant={'contained'}>
                                    {confirmButtonText ? confirmButtonText : 'Confirm'}
                                </PrimaryButton>
                            </>
                        )}
                    </Stack>
                </Grid>
            </Grid>
        </Grid>
    );
};

export default ConfirmModal;
