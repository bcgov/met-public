import React, { useContext, useState } from 'react';
import { Modal } from '@mui/material';
import SuccessPanel from './SuccessPanel';
import FailurePanel from './FailurePanel';
import EmailPanel from './EmailPanel';
import TabContext from '@mui/lab/TabContext';
import TabPanel from '@mui/lab/TabPanel';
import { EmailModalProps } from './types';
import { checkEmail } from 'utils';
import { createEmailVerification } from 'services/emailVerificationService';
import { openNotification } from 'services/notificationService/notificationSlice';
import { useAppDispatch } from 'hooks';
import { ActionContext } from './ActionContext';

const EmailModal = ({ open, handleClose }: EmailModalProps) => {
    const dispatch = useAppDispatch();
    const [formIndex, setFormIndex] = useState('email');
    const [email, setEmail] = useState('');
    const { savedEngagement } = useContext(ActionContext);
    const [isSaving, setSaving] = useState(false);

    const close = () => {
        handleClose();
        setFormIndex('email');
    };

    const updateTabValue = () => {
        if (!checkEmail(email)) {
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
            <TabContext value={formIndex}>
                <TabPanel value="email">
                    <EmailPanel
                        email={email}
                        checkEmail={updateTabValue}
                        handleClose={() => close()}
                        updateEmail={setEmail}
                        isSaving={isSaving}
                    />
                </TabPanel>
                <TabPanel value="success">
                    <SuccessPanel
                        mainText={'We sent a link to access the survey at the following email address:'}
                        subTextArray={[
                            'Please Click the link provided to access the survey.',
                            'The link will be valid for 24 hours.',
                        ]}
                        handleClose={() => close()}
                        email={email}
                    />
                </TabPanel>
                <TabPanel value="error">
                    <FailurePanel tryAgain={() => setFormIndex('email')} handleClose={() => close()} email={email} />
                </TabPanel>
            </TabContext>
        </Modal>
    );
};

export default EmailModal;
