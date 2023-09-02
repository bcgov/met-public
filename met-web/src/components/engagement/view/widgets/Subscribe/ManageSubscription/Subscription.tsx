import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Grid } from '@mui/material';
import { MetHeader1, MetParagraph, MetHeader4 } from 'components/common';
import { Banner } from 'components/banner/Banner';
import LandingPageBanner from 'assets/images/LandingPageBanner.png';
import { useAppDispatch, useAppSelector } from 'hooks';
import { openNotification } from 'services/notificationService/notificationSlice';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import { SubscriptionType } from './subscribe';
import { verifyEmailVerification } from 'services/emailVerificationService';
import { confirmSubscription, unSubscribe } from 'services/subscriptionService';

export type SubscriptionParams = {
    engagementId: string;
    subscriptionStatus: string;
    scriptionKey?: string;
};

export const Subscription = () => {
    const { engagementId, subscriptionStatus, scriptionKey } = useParams<SubscriptionParams>();
    const [subscriptionText, setSubscriptionText] = useState(['']);

    const dispatch = useAppDispatch();

    const tenant = useAppSelector((state) => state.tenant);

    useEffect(() => {
        verifySubscribeKey();
    }, [scriptionKey]);

    const verifySubscribeKey = async () => {
        try {
            if (!scriptionKey) {
                return;
            }
            if (subscriptionStatus == SubscriptionType.SUBSCRIBE) {
                const token = scriptionKey;
                const subscribed_email = await verifyEmailVerification(token);
                const subscribed = JSON.stringify(subscribed_email);
                await confirmSubscription({
                    engagement_id: parseInt(engagementId ?? ''),
                    participant_id: JSON.parse(subscribed).participant_id,
                    is_subscribed: 'true',
                });
                setSubscriptionText(['You have successfully confirmed your subscription. Thank you.']);
            }
            if (subscriptionStatus == SubscriptionType.UNSUBSCRIBE) {
                const participant_id = scriptionKey;
                await unSubscribe({
                    participant_id: parseInt(participant_id ?? ''),
                    is_subscribed: 'false',
                });
                setSubscriptionText([
                    'We are sorry to see you go.',
                    '',
                    'We wanted to confirm that you have been successfully unsubscribed from all of our emails.',
                    '',
                    'You will no longer receive any communications from us.',
                    '',
                    'Thank you.',
                ]);
            }
        } catch (error) {
            dispatch(openNotification({ severity: 'error', text: 'Error Subscribing to Engagement' }));
            return Promise.reject(error);
        }
    };

    return (
        <Grid container direction="row" justifyContent={'center'} alignItems="center">
            <Grid item xs={12}>
                <Banner height={'330px'} imageUrl={LandingPageBanner}>
                    <Grid
                        container
                        direction="row"
                        justifyContent="flex-start"
                        alignItems="flex-start"
                        height="100%"
                        sx={{
                            position: 'absolute',
                            top: '0px',
                            left: '0px',
                        }}
                    >
                        <Grid
                            item
                            lg={6}
                            sm={12}
                            container
                            direction="row"
                            justifyContent="flex-start"
                            alignItems="flex-start"
                            sx={{
                                backgroundColor: 'rgba(242, 242, 242, 0.95)',
                                padding: '1em',
                                margin: '1em',
                                maxWidth: '90%',
                            }}
                            m={{ lg: '3em 5em 0 3em', md: '3em', sm: '1em' }}
                            rowSpacing={2}
                        >
                            <Grid item xs={12}>
                                <MetHeader1>{tenant?.name}</MetHeader1>
                            </Grid>
                            <Grid item xs={12}>
                                <MetParagraph>{'Description'}</MetParagraph>
                            </Grid>
                        </Grid>
                    </Grid>
                </Banner>
            </Grid>
            <Grid
                item
                lg={12}
                sm={12}
                container
                direction="row"
                justifyContent="flex-start"
                alignItems="flex-start"
                sx={{
                    padding: '1em',
                    maxWidth: '100%',
                }}
                m={{ lg: '3em 5em 0 3em', md: '3em', sm: '1em' }}
                rowSpacing={2}
            >
                <CheckCircleRoundedIcon style={{ color: '#2e8540', fontSize: 50 }} />
                <MetHeader4 bold m={{ lg: '.5em 0 0 .5em', md: '3em', sm: '1em' }}>
                    {subscriptionText.map((text) => (
                        <>
                            {text}
                            <br />
                        </>
                    ))}
                </MetHeader4>
            </Grid>
        </Grid>
    );
};

export default Subscription;
