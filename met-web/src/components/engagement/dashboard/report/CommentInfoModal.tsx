import React from 'react';
import { Modal, Grid, Typography } from '@mui/material';
import { modalStyle, SecondaryButton } from 'components/common';

interface CommentInfoModalProps {
    modalOpen: boolean;
    handleCloseModal: () => void;
}
const CommentInfoModal = ({ modalOpen, handleCloseModal }: CommentInfoModalProps) => {
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
                sx={{ ...modalStyle, overflow: 'auto' }}
                rowSpacing={2}
            >
                <Grid container item xs={12}>
                    <Grid item xs={12}>
                        <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                            View Comments
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="subtitle1" sx={{ mb: 1 }}>
                            The comments will only be available to view after the engagement period is over and the
                            engagement is closed.
                        </Typography>
                    </Grid>
                </Grid>
                <Grid item xs={12} container direction={{ xs: 'column', sm: 'row' }} justifyContent="flex-end">
                    <SecondaryButton onClick={handleClose}>Close</SecondaryButton>
                </Grid>
            </Grid>
        </Modal>
    );
};

export default CommentInfoModal;
