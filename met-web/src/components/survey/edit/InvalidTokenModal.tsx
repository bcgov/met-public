import React from 'react';
import { Grid, Modal } from '@mui/material';
import { InvalidTokenModalProps } from '../types';
import { modalStyle, PrimaryButtonOld, MetHeader1Old, MetBodyOld } from 'components/common';
import { useAppTranslation } from 'hooks';

export const InvalidTokenModal = ({ open, handleClose }: InvalidTokenModalProps) => {
    const { t: translate } = useAppTranslation();

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
                    <MetHeader1Old bold sx={{ mb: 2 }}>
                        {translate('surveySubmit.inValidToken.header')}
                    </MetHeader1Old>
                </Grid>
                <Grid item xs={12}>
                    <MetBodyOld>{translate('surveySubmit.inValidToken.bodyLine1')}</MetBodyOld>
                </Grid>
                <Grid item xs={12}>
                    <MetBodyOld sx={{ p: '1em', borderLeft: 8, borderColor: '#003366', backgroundColor: '#F2F2F2' }}>
                        {translate('surveySubmit.inValidToken.reasons.1')}
                        <br />
                        {translate('surveySubmit.inValidToken.reasons.2')}
                    </MetBodyOld>
                </Grid>
                <Grid item container xs={12} justifyContent="flex-end" spacing={1} sx={{ mt: '1em' }}>
                    <PrimaryButtonOld onClick={handleClose}>
                        {translate('surveySubmit.inValidToken.button')}
                    </PrimaryButtonOld>
                </Grid>
            </Grid>
        </Modal>
    );
};
