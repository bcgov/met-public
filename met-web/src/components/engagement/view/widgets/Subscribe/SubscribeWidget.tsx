import React, { useState, useContext } from 'react';
import { MetBody, MetHeader2, MetPaper, PrimaryButton } from 'components/common';
import { ActionContext } from '../../ActionContext';
import { Grid } from '@mui/material';
import { useAppDispatch } from 'hooks';
import { openNotificationModal } from 'services/notificationModalService/notificationModalSlice';
import EmailModal from 'components/common/Modals/EmailModal';
import { createEmailVerification } from 'services/emailVerificationService';
import { EmailVerificationType } from 'models/emailVerification';

function SubscribeWidget() {
    const dispatch = useAppDispatch();
    const { savedEngagement } = useContext(ActionContext);
    const [email, setEmail] = useState('');
    const [open, setOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const sendEmail = async () => {
        try {
            setIsSaving(true);
            await createEmailVerification({
                email_address: email,
                survey_id: savedEngagement.surveys[0].id,
                type: EmailVerificationType.Subscribe,
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
                                text: 'We sent a link to confirm your subscription at the following email address ${email}',
                                bold: false,
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
                                bold: false,
                            },
                            {
                                text: 'Please verify your email and try again.',
                                bold: false,
                            },
                            {
                                text: 'If this problem persists, contact sample@gmail.com',
                                bold: false,
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

    return (
        <MetPaper elevation={1} sx={{ padding: '1em', minHeight: '12em' }}>
            <EmailModal
                open={open}
                updateModal={setOpen}
                email={email}
                updateEmail={setEmail}
                handleConfirm={sendEmail}
                isSaving={isSaving}
                termsOfService={[
                    'Personal information (your email address is collected under Section 26(c) and 26(e) of the Freedom of the Information and Protection of Privacy Act, to keep you updated on current engagements and to notify you of future opportunities to participate.',
                    '',
                    'If you have any questions about the collection, use and disclosure of your personal information, please contact <TBC>.',
                    '',
                ]}
                header={'Sign Up for Updates'}
                subText={[
                    {
                        text: 'Sign up to receive news and updates on public engagements at the EAO.',
                        bold: false,
                    },
                ]}
            />
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
                    <PrimaryButton onClick={() => setOpen(true)} sx={{ width: '100%' }}>
                        Sign Up for Updates from the EAO
                    </PrimaryButton>
                </Grid>
            </Grid>
        </MetPaper>
    );
}

export default SubscribeWidget;
