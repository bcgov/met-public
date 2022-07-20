import React, { useState } from 'react';
import { Modal } from '@mui/material';
import SuccessPanel from './SuccessPanel';
import FailurePanel from './FailurePanel';
import EmailPanel from './EmailPanel';
import TabContext from '@mui/lab/TabContext';
import TabPanel from '@mui/lab/TabPanel';
import { EmailModalProps } from './types';
import { checkEmail } from 'utils';

function EmailModal(props: EmailModalProps) {
    const [formIndex, setFormIndex] = useState('email');
    const [email, setEmail] = useState('');

    function handleClose() {
        props.handleClose();
        setFormIndex('email');
    }

    function updateTabValue() {
        if (!checkEmail(email)) {
            setFormIndex('error');
        } else {
            setFormIndex('success');
        }
    }

    return (
        <>
            <Modal
                open={props.open}
                onClose={props.handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <TabContext value={formIndex}>
                    <TabPanel value="email">
                        <EmailPanel
                            email={email}
                            checkEmail={updateTabValue}
                            handleClose={() => handleClose()}
                            updateEmail={setEmail}
                        />
                    </TabPanel>
                    <TabPanel value="success">
                        <SuccessPanel handleClose={() => handleClose()} email={email} />
                    </TabPanel>
                    <TabPanel value="error">
                        <FailurePanel
                            tryAgain={() => setFormIndex('email')}
                            handleClose={() => handleClose()}
                            email={email}
                        />
                    </TabPanel>
                </TabContext>
            </Modal>
        </>
    );
}

export default EmailModal;
