import React, { useState, useContext } from 'react';
import { MetBody, MetHeader2, MetLabel, MetPaper, MetParagraph, PrimaryButton } from 'components/common';
import { ActionContext } from '../../ActionContext';
import { Grid, Divider, Link, Typography, Box, RadioGroup, Radio, FormControlLabel } from '@mui/material';
import { useAppDispatch } from 'hooks';
import { openNotificationModal } from 'services/notificationModalService/notificationModalSlice';
import EmailModal from 'components/common/Modals/EmailModal';
import { createEmailVerification } from 'services/emailVerificationService';
import { createSubscription } from 'services/subscriptionService';
import { EmailVerificationType } from 'models/emailVerification';
import { SubscriptionType } from 'constants/subscriptionType';

function SubscribeWidget() {
    const dispatch = useAppDispatch();
    const { savedEngagement, engagementMetadata } = useContext(ActionContext);
    const defaultType = engagementMetadata.project_id ? SubscriptionType.PROJECT : SubscriptionType.ENGAGEMENT;
    const [email, setEmail] = useState('');
    const [open, setOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [subscriptionType, setSubscriptionType] = useState('');

    const sendEmail = async () => {
        try {
            setIsSaving(true);
            const email_verification = await createEmailVerification({
                email_address: email,
                survey_id: savedEngagement.surveys[0].id,
                type: EmailVerificationType.Subscribe,
            });

            await createSubscription({
                engagement_id: savedEngagement.id,
                email_address: email_verification.email_address,
                is_subscribed: 'false',
                participant_id: email_verification.participant_id,
                project_id: engagementMetadata.project_id,
                type: subscriptionType ? subscriptionType : defaultType,
            });

            window.snowplow('trackSelfDescribingEvent', {
                schema: 'iglu:ca.bc.gov.met/verify-email/jsonschema/1-0-0',
                data: { survey_id: savedEngagement.surveys[0].id, engagement_id: savedEngagement.id },
            });
            setOpen(false);
            dispatch(
                openNotificationModal({
                    open: true,
                    data: {
                        header: 'Thank you',
                        subText: [
                            {
                                text:
                                    'We sent a link to confirm your subscription at the following email address ' +
                                    email,
                            },
                            {
                                text: 'Please click the link provided to confirm your interest in receiving news and updates from the EAO.',
                                bold: true,
                            },
                        ],
                    },
                    type: 'update',
                }),
            );
        } catch (error) {
            setOpen(false);
            dispatch(
                openNotificationModal({
                    open: true,
                    data: {
                        header: 'We are sorry',
                        subText: [
                            {
                                text: `There was a problem with the email address you provided: ${email}`,
                            },
                            {
                                text: 'Please verify your email and try again.',
                            },
                            {
                                text: 'If this problem persists, contact sample@gmail.com',
                            },
                        ],
                    },
                    type: 'update',
                }),
            );
        } finally {
            setIsSaving(false);
        }
    };

    const handleSubscriptionChange = (type: string) => {
        setSubscriptionType(type);
    };

    return (
        <MetPaper elevation={1} sx={{ padding: '1em', minHeight: '12em' }}>
            <EmailModal
                open={open}
                updateModal={setOpen}
                email={email}
                updateEmail={setEmail}
                handleConfirm={sendEmail}
                isSaving={isSaving}
                termsOfService={
                    <Box
                        sx={{
                            p: '1em',
                            borderLeft: 8,
                            borderColor: '#003366',
                            backgroundColor: '#F2F2F2',
                            mt: '0.5em',
                        }}
                    >
                        <Typography sx={{ fontSize: '0.8rem', mb: 1 }}>
                            Personal information (your email address) is collected under Section 26(c) and 26(e) of the
                            Freedom of Information and Protection of Privacy Act, for the purpose of providing content
                            updates and future opportunities to participate. Your email is never shared with third
                            parties.
                        </Typography>
                        <Typography sx={{ fontSize: '0.8rem', mb: 1 }}>
                            If you have any questions about the collection, use and disclosure of your personal
                            information, please contact the Director of Digital Services at{' '}
                            <Link href="mailto:Sid.Tobias@gov.bc.ca">Sid.Tobias@gov.bc.ca</Link>
                        </Typography>
                    </Box>
                }
                header={'Sign Up for Updates'}
                subText={[
                    {
                        text: 'Sign up to receive news and updates on public engagements.',
                    },
                ]}
                signupoptions={
                    <Grid item xs={12}>
                        <MetLabel>Please choose your preferred email update option:</MetLabel>
                        <RadioGroup
                            defaultValue={defaultType}
                            onChange={(e) => handleSubscriptionChange(e.target.value)}
                        >
                            <FormControlLabel
                                value={
                                    engagementMetadata.project_id
                                        ? SubscriptionType.PROJECT
                                        : SubscriptionType.ENGAGEMENT
                                }
                                control={<Radio />}
                                label={
                                    <MetParagraph>
                                        I want to receive updates for {''}
                                        {engagementMetadata.project_id
                                            ? engagementMetadata.project_metadata.project_name
                                            : savedEngagement.name}
                                        {''} only
                                    </MetParagraph>
                                }
                            />
                            <FormControlLabel
                                value={SubscriptionType.TENANT}
                                control={<Radio />}
                                label={
                                    <MetParagraph>
                                        I want to receive updates for all the projects at the Environmental Assessment
                                        Office
                                    </MetParagraph>
                                }
                            />
                        </RadioGroup>
                    </Grid>
                }
            />
            <Grid spacing={2} container xs={12}>
                <Grid item xs={12}>
                    <MetHeader2 bold>Sign Up for Updates</MetHeader2>
                    <Divider sx={{ borderWidth: 1, marginTop: 0.5 }} />
                </Grid>
                <Grid item xs={12}>
                    <MetBody>
                        If you are interested in getting updates on public engagements at the EAO, you can sign up
                        below:
                    </MetBody>
                </Grid>
                <Grid item xs={12}>
                    <PrimaryButton onClick={() => setOpen(true)} sx={{ width: '100%' }}>
                        Sign Up for Updates
                    </PrimaryButton>
                </Grid>
            </Grid>
        </MetPaper>
    );
}

export default SubscribeWidget;
