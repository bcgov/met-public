import React, { useContext, useState } from 'react';
import { Box, Modal } from '@mui/material';
import SuccessPanel from './SuccessPanel';
import FailurePanel from './FailurePanel';
import EmailPanel from './EmailPanel';
import TabContext from '@mui/lab/TabContext';
import TabPanel from '@mui/lab/TabPanel';
import { EmailModalProps } from './types';
import { checkEmail } from 'utils';
import { createEmailVerification } from 'services/emailVerificationService';
import { openNotification } from 'services/notificationService/notificationSlice';
import { useAppDispatch, useAppSelector } from 'hooks';
import { ActionContext } from './ActionContext';
import ThankYouPanel from './ThankYouPanel';
import { EmailVerificationType } from 'models/emailVerification';
import { INTERNAL_EMAIL_DOMAIN } from 'constants/emailVerification';
import { LanguageState } from 'reduxSlices/languageSlice';

const EmailModal = ({ defaultPanel, open, handleClose }: EmailModalProps) => {
    const dispatch = useAppDispatch();
    const [formIndex, setFormIndex] = useState(defaultPanel);
    const [email, setEmail] = useState('');
    const { savedEngagement } = useContext(ActionContext);
    const [isSaving, setSaving] = useState(false);
    const language: LanguageState = useAppSelector((state) => state.language);

    const close = () => {
        handleClose();
        setFormIndex('email');
    };

    const updateTabValue = () => {
        if (!checkEmail(email)) {
            setFormIndex('error');
        } else if (savedEngagement.is_internal && !email.endsWith(INTERNAL_EMAIL_DOMAIN)) {
            setFormIndex('error');
        } else {
            handleSubmit();
        }
    };

    const handleSubmit = async () => {
        try {
            setSaving(true);
            await createEmailVerification({
                email_address: email,
                survey_id: savedEngagement.surveys[0].id,
                type: EmailVerificationType.Survey,
                language: language.id,
            });
            window.snowplow('trackSelfDescribingEvent', {
                schema: 'iglu:ca.bc.gov.met/verify-email/jsonschema/1-0-0',
                data: { survey_id: savedEngagement.surveys[0].id, engagement_id: savedEngagement.id },
            });
            dispatch(
                openNotification({
                    severity: 'success',
                    text: 'Email verification has been sent',
                }),
            );
            setFormIndex('success');
        } catch (error) {
            dispatch(
                openNotification({
                    severity: 'error',
                    text: 'Error occurred while sending the email verification',
                }),
            );
            setFormIndex('error');
        } finally {
            setSaving(false);
        }
    };

    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box>
                <TabContext value={formIndex}>
                    <TabPanel value="email">
                        <EmailPanel
                            email={email}
                            checkEmail={updateTabValue}
                            handleClose={() => close()}
                            updateEmail={setEmail}
                            isSaving={isSaving}
                            isInternal={savedEngagement.is_internal}
                        />
                    </TabPanel>
                    <TabPanel value="success">
                        <SuccessPanel handleClose={() => close()} email={email} />
                    </TabPanel>
                    <TabPanel value="thank you">
                        <ThankYouPanel handleClose={() => close()} />
                    </TabPanel>
                    <TabPanel value="error">
                        <FailurePanel
                            tryAgain={() => setFormIndex('email')}
                            handleClose={() => close()}
                            email={email}
                            isInternal={savedEngagement.is_internal}
                        />
                    </TabPanel>
                </TabContext>
            </Box>
        </Modal>
    );
};

export default EmailModal;
