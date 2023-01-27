import React from 'react';
import { Grid, Modal } from '@mui/material';
import { PrimaryButton, modalStyle } from 'components/common';
import PreviewEmail from './PreviewEmail';
import { ModalSubtext } from 'components/common/Modals/types';

type EmailModal = {
    open: boolean;
    header: string;
    emailText: ModalSubtext[];
    handleClose: () => void;
};

const EmailPreviewModal = ({ open, header, emailText, handleClose }: EmailModal) => {
    return (
        <Modal open={open} onClose={() => handleClose()}>
            <Grid
                container
                direction="column"
                alignItems="center"
                justifyContent="center"
                sx={{ ...modalStyle }}
                rowSpacing={2}
            >
                <Grid sx={{ alignItems: 'center', justifyContent: 'center' }} item xs={12}>
                    <PreviewEmail header={header} emailText={emailText} />
                </Grid>
                <Grid item xs={3}>
                    <PrimaryButton onClick={handleClose}>Close Preview</PrimaryButton>
                </Grid>
            </Grid>
        </Modal>
    );
};

export default EmailPreviewModal;
