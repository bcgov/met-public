import React from 'react';
import { Grid2 as Grid, Modal } from '@mui/material';
import { modalStyle } from 'components/common';
import { Button } from 'components/common/Input/Button';

type EmailModal = {
    open: boolean;
    header: string;
    renderEmail: React.ReactNode;
    handleClose: () => void;
};

const EmailPreviewModal = ({ open, header, renderEmail, handleClose }: EmailModal) => {
    return (
        <Modal open={open} onClose={() => handleClose()}>
            <Grid
                container
                direction="column"
                alignItems="center"
                justifyContent="center"
                sx={{
                    ...modalStyle,
                }}
                rowSpacing={2}
            >
                <Grid sx={{ alignItems: 'center', justifyContent: 'center' }} size={12}>
                    {renderEmail}
                </Grid>
                <Grid size={3}>
                    <Button variant="primary" onClick={() => handleClose()}>
                        Close Preview
                    </Button>
                </Grid>
            </Grid>
        </Modal>
    );
};

export default EmailPreviewModal;
