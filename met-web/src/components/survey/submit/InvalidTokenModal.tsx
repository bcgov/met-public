import React from 'react';
import { Grid, Modal } from '@mui/material';
import { modalStyle } from 'components/common';
import { useAppSelector, useAppTranslation } from 'hooks';
import { useNavigate, useRouteLoaderData } from 'react-router';
import { Button } from 'components/common/Input';
import { BodyText } from 'components/common/Typography';

export const InvalidTokenModal = () => {
    const { t: translate } = useAppTranslation();
    const isLoggedIn = useAppSelector((state) => state.user.authentication.authenticated);
    const navigate = useNavigate();
    const { verification, slug } = useRouteLoaderData('survey');
    const languagePath = `/${sessionStorage.getItem('languageId')}`;

    const navigateToEngagement = () => {
        navigate(`/${slug}/${languagePath}`);
    };

    return (
        <Modal
            open={!verification && !isLoggedIn}
            onClose={navigateToEngagement}
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
                    <BodyText bold sx={{ mb: 2 }}>
                        {translate('surveySubmit.inValidToken.header')}
                    </BodyText>
                </Grid>
                <Grid item xs={12}>
                    <BodyText>{translate('surveySubmit.inValidToken.bodyLine1')}</BodyText>
                </Grid>
                <Grid item xs={12}>
                    <BodyText sx={{ p: '1em', borderLeft: 8, borderColor: '#003366', backgroundColor: '#F2F2F2' }}>
                        <ul>
                            <li>{translate('surveySubmit.inValidToken.reasons.0')}</li>
                            <li>{translate('surveySubmit.inValidToken.reasons.1')}</li>
                            <li>{translate('surveySubmit.inValidToken.reasons.2')}</li>
                        </ul>
                    </BodyText>
                </Grid>
                <Grid item container xs={12} justifyContent="flex-end" spacing={1} sx={{ mt: '1em' }}>
                    <Button variant="primary" onClick={navigateToEngagement}>
                        {translate('surveySubmit.inValidToken.button')}
                    </Button>
                </Grid>
            </Grid>
        </Modal>
    );
};
