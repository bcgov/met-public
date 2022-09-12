import React from 'react';
import { Grid, Stack, useMediaQuery, Theme } from '@mui/material';
import { modalStyle, PrimaryButton, SecondaryButton, MetHeader1, MetBody } from 'components/common';
import { ModalProps } from './types';

const ConfirmModal = ({ header, subText, handleClose, buttons }: ModalProps) => {
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
            <Grid container item xs={12}>
                <Grid item xs={12}>
                    <MetHeader1 sx={{ fontWeight: 'bold', mb: 2 }}>{header}</MetHeader1>
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
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} width="100%" justifyContent="flex-end">
                        {isSmallScreen ? (
                            <>
                                <PrimaryButton
                                    onClick={() => buttons[0].buttonFunction}
                                    type="submit"
                                    variant={'contained'}
                                >
                                    {buttons[0].buttonText}
                                </PrimaryButton>
                                <SecondaryButton onClick={buttons[1].buttonFunction}>
                                    {buttons[1].buttonText}
                                </SecondaryButton>
                            </>
                        ) : (
                            <>
                                <SecondaryButton onClick={buttons[1].buttonFunction}>
                                    {buttons[1].buttonText}
                                </SecondaryButton>
                                <PrimaryButton
                                    onClick={() => buttons[0].buttonFunction}
                                    type="submit"
                                    variant={'contained'}
                                >
                                    {buttons[0].buttonText}
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
