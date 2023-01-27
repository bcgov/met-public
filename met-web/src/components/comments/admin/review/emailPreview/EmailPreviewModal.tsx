import React from 'react';
import { Grid, Modal, Box } from '@mui/material';
import { PrimaryButton, modalStyle } from 'components/common';
import PreviewEmail from './PreviewEmail';

const EmailPreviewModal = ({ header, emailText, handleClose }: any) => {
    return (
        <Modal open={true} onClose={() => handleClose()}>
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
