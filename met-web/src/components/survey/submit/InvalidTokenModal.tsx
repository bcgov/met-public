import React from 'react';
import { Grid, Typography, Modal, Button } from '@mui/material';
import { InvalidTokenModalProps } from '../types';
import { modalStyle, PrimaryButton } from 'components/common';

export const InvalidTokenModal = ({ open, handleClose }: InvalidTokenModalProps) => {
    return (
        <Modal
            open={open}
            onClose={() => handleClose()}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Grid
                container
                direction="row"
                sx={{ ...modalStyle }}
                justifyContent="flex-start"
                alignItems="flex-start"
                spacing={2}
            >
                <Grid item xs={12}>
                    <Typography variant="h4" sx={{ mb: 2, fontWeight: 'bold' }}>
                        Oops! Something Went Wrong
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    <Typography>
                        You are trying to access a survey through an invalid link, please check the possible reasons:
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    <Typography
                        variant="subtitle2"
                        sx={{ p: '1em', borderLeft: 8, borderColor: '#003366', backgroundColor: '#F2F2F2' }}
                    >
                        The survey link is expired (24 hours). Or
                        <br />
                        This link has already been previously used. Or
                        <br />
                        The engagement period is over.
                    </Typography>
                </Grid>
                <Grid item container xs={12} justifyContent="flex-end" spacing={1} sx={{ mt: '1em' }}>
                    <PrimaryButton variant="contained" onClick={handleClose}>
                        Back to Engagement
                    </PrimaryButton>
                </Grid>
            </Grid>
        </Modal>
    );
};
