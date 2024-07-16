import { Modal } from '@mui/material';
import React from 'react';
import { useBlocker } from 'react-router-dom';
import ConfirmModal from '../Modals/ConfirmModal';

interface UnsavedWorkConfirmationProps {
    blockNavigationWhen: boolean;
}

const UnsavedWorkConfirmation: React.FC<UnsavedWorkConfirmationProps> = ({ blockNavigationWhen }) => {
    const blocker = useBlocker(
        ({ currentLocation, nextLocation }) =>
            blockNavigationWhen && nextLocation.pathname !== currentLocation.pathname,
    );

    return (
        <Modal open={blocker.state === 'blocked'} onClose={blocker.reset}>
            <ConfirmModal
                style="warning"
                header="Unsaved Changes"
                subHeader="Are you sure you want to leave this page?"
                subText={[{ text: 'If you leave this page, your changes will be lost.' }]}
                cancelButtonText="Stay"
                confirmButtonText="Leave"
                handleClose={blocker.reset}
                handleConfirm={blocker.proceed}
            />
        </Modal>
    );
};

export default UnsavedWorkConfirmation;
