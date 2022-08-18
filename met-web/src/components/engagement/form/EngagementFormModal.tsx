import React, { useContext } from 'react';
import { Modal, Grid, Typography, Stack } from '@mui/material';
import { ActionContext } from './ActionContext';
import { modalStyle, PrimaryButton, SecondaryButton } from 'components/common';

const EngagementFormModal = () => {
    const { modalState, handleCloseModal } = useContext(ActionContext);

    const { modalOpen, handleConfirm } = modalState;

    const handleClose = () => {
        handleCloseModal();
    };

    return (
        <Modal
            open={modalOpen}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
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
                        <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                            Remove Survey
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="subtitle1" sx={{ mb: 1 }}>
                            You will be removing this survey from the engagement. This survey will not be deleted and
                            will be available to add to any engagement.
                        </Typography>
                    </Grid>
                </Grid>
                <Grid container direction="row" item xs={12}>
                    <Grid item xs={12}>
                        <Typography variant="body1" sx={{ mb: 1, fontWeight: 'bold' }}>
                            Do you want to remove this survey?
                        </Typography>
                    </Grid>

                    <Grid item container xs={12} justifyContent="flex-end" spacing={1} sx={{ mt: '1em' }}>
                        <Stack
                            direction={{ xs: 'column', sm: 'row' }}
                            spacing={1}
                            width="100%"
                            justifyContent="flex-end"
                        >
                            <SecondaryButton onClick={handleClose}>Cancel</SecondaryButton>
                            <PrimaryButton type="submit" variant={'contained'} onClick={handleConfirm}>
                                Confirm
                            </PrimaryButton>
                        </Stack>
                    </Grid>
                </Grid>
            </Grid>
        </Modal>
    );
};

export default EngagementFormModal;
