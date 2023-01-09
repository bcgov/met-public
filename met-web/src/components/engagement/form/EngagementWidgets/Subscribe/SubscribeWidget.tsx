import React from 'react';
import { MetBody, MetHeader2, MetPaper, PrimaryButton } from 'components/common';
import { Grid } from '@mui/material';
import { useAppDispatch } from 'hooks';
import {
    openNotificationModal,
    closeNotificationModal,
} from 'services/notificationModalService/notificationModalSlice';

function SubscribeWidget() {
    const dispatch = useAppDispatch();

    const sendEmail = () => {
        console.log('SEND EMAIL!!!!!!!!!!');
        openNotificationModal({
            open: true,
            data: {
                header: 'Thank you',
                subText: [
                    'We sent a link to confirm your subscription at the following email address email@address.ca',
                    'Please click the link provided to confirm your interest in receiving news and updates from the EAO.',
                ],
            },
            type: 'update',
        });
    };

    const confirmSubscription = () => {
        dispatch(
            openNotificationModal({
                open: true,
                data: {
                    header: 'Sign Up for Updates',
                    subText: ['Sign up to receive news and updates on public engagements at the EAO', 'TOS BLOCK'],
                    handleConfirm: () => {
                        sendEmail();
                    },
                },
                type: 'confirm',
            }),
        );
    };

    return (
        <MetPaper elevation={1} sx={{ padding: '1em', minHeight: '12em' }}>
            <Grid spacing={2} container xs={12} sx={{ pl: '1em' }}>
                <Grid item xs={12}>
                    <MetHeader2 bold>Sign Up for Updates</MetHeader2>
                </Grid>
                <Grid item xs={12}>
                    <MetBody>
                        If you are interested in getting updates on public engagements at the EAO, you can sign up
                        below:
                    </MetBody>
                </Grid>
                <Grid item xs={12}>
                    <PrimaryButton onClick={() => confirmSubscription()} sx={{ width: '100%' }}>
                        Sign Up for Updates from the EAO
                    </PrimaryButton>
                </Grid>
            </Grid>
        </MetPaper>
    );
}

export default SubscribeWidget;
