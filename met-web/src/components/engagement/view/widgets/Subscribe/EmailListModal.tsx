import React, { useState, useContext } from 'react';
import { MetDisclaimer } from 'components/common';
import { ActionContext } from '../../ActionContext';
import { useAppDispatch } from 'hooks';
import { openNotificationModal } from 'services/notificationModalService/notificationModalSlice';
import EmailModal from 'components/common/Modals/EmailModal';
import { createSubscribeEmailVerification } from 'services/emailVerificationService';
import { createSubscription } from 'services/subscriptionService';
import { EmailVerificationType } from 'models/emailVerification';
import { SubscriptionType } from 'constants/subscriptionType';
import { Editor } from 'react-draft-wysiwyg';
import { getEditorStateFromRaw } from 'components/common/RichTextEditor/utils';

const EmailListModal = ({ open, setOpen }: { open: boolean; setOpen: (open: boolean) => void }) => {
    const dispatch = useAppDispatch();
    const { savedEngagement } = useContext(ActionContext);
    const defaultType = SubscriptionType.ENGAGEMENT;
    const [email, setEmail] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    const sendEmail = async () => {
        try {
            setIsSaving(true);
            const email_verification = await createSubscribeEmailVerification(
                {
                    email_address: email,
                    survey_id: savedEngagement.surveys[0].id,
                    type: EmailVerificationType.Subscribe,
                },
                defaultType,
            );

            await createSubscription({
                engagement_id: savedEngagement.id,
                email_address: email_verification.email_address,
                is_subscribed: false,
                participant_id: email_verification.participant_id,
                type: defaultType,
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

    return (
        <EmailModal
            open={open}
            updateModal={setOpen}
            email={email}
            updateEmail={setEmail}
            handleConfirm={sendEmail}
            isSaving={isSaving}
            termsOfService={
                <MetDisclaimer>
                    <Editor
                        editorState={getEditorStateFromRaw(savedEngagement.consent_message)}
                        readOnly={true}
                        toolbarHidden
                    />
                </MetDisclaimer>
            }
            header={'Sign Up for Updates'}
            subText={[
                {
                    text: 'Sign up to receive news and updates on public engagements.',
                },
            ]}
            signupoptions={null}
        />
    );
};

export default EmailListModal;
