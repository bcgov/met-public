import React, { useContext } from 'react';
import { Modal, Grid, Stack } from '@mui/material';
import { ActionContext } from './ActionContext';
import { modalStyle, PrimaryButton, SecondaryButton, MetHeader1, MetBody, ModalSubtitle } from 'components/common';

const EngagementFormModal = () => {
    const { modalState, handleCloseModal } = useContext(ActionContext);

    const { modalOpen, handleConfirm } = modalState;

    const handleClose = () => {
        handleCloseModal();
    };

    return (
        <Modal open={modalOpen} onClose={handleClose}>
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
                        <MetHeader1 bold={true} sx={{ mb: 1 }}>
                            Remove Survey
                        </MetHeader1>
                    </Grid>
                    <Grid item xs={12}>
                        <ModalSubtitle sx={{ mb: 1 }}>
                            You will be removing this survey from the engagement. This survey will not be deleted and
                            will be available to add to any engagement.
                        </ModalSubtitle>
                    </Grid>
                </Grid>
                <Grid container direction="row" item xs={12}>
                    <Grid item xs={12}>
                        <MetBody sx={{ mb: 1, fontWeight: 'bold' }}>Do you want to remove this survey?</MetBody>
                    </Grid>

                    <Grid
                        item
                        container
                        direction="row"
                        xs={12}
                        justifyContent="flex-end"
                        spacing={1}
                        sx={{ mt: '1em' }}
                    >
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
