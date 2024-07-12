import React from 'react';
import { ResponsiveContainer } from 'components/common/Layout';
import { BodyText, Header1 } from 'components/common/Typography';
import { Button } from 'components/common/Input';
import ConfirmModal from 'components/common/Modals/ConfirmModal';
import { useNavigate } from 'react-router-dom';
import { Modal, Skeleton } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/pro-regular-svg-icons';

const EngagementCreationWizard = () => {
    const [open, setOpen] = React.useState(true);
    const navigate = useNavigate();
    return (
        <ResponsiveContainer>
            <Modal open={open} onClose={() => setOpen(false)}>
                <ConfirmModal
                    style={'default'}
                    header={'You are using a preview version of the new engagement creation wizard.'}
                    subHeader={'Do you want to continue using the preview version?'}
                    subText={[
                        { text: 'The classic form is available for use if you prefer.' },
                        { text: 'Some features may not be available or may not work as expected.' },
                    ]}
                    handleConfirm={() => setOpen(false)}
                    handleClose={() => navigate('/engagements/create/form')}
                    confirmButtonText={'Yes, use wizard preview'}
                    cancelButtonText={'No, go to classic form'}
                />
            </Modal>
            <Header1>Engagement Configuration</Header1>
            <BodyText bold size="large">
                In order to create your new engagement we’ll need to configure a few things first.
            </BodyText>
            <br />
            <BodyText>
                <FontAwesomeIcon icon={faInfoCircle} style={{ marginRight: '8px' }} />
                <i>
                    Not 100% sure about everything yet? Don’t worry. You will always be able to update this
                    configuration.
                </i>
            </BodyText>
            {/* This will never actually load - this is a page skeleton pending DESENG-655*/}
            <Skeleton sx={{ width: '100%', maxWidth: '720px', height: '200px' }} />
            <Button sx={{ mr: '16px' }} disabled variant="primary">
                Create Engagement
            </Button>
            <Button href="/engagements">Cancel</Button>
        </ResponsiveContainer>
    );
};

export default EngagementCreationWizard;
