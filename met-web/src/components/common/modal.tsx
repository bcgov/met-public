import * as React from 'react';
import { useAppSelector, useAppDispatch } from '../../hooks';
import Modal from '@mui/material/Modal';
import { closeNotificationModal } from 'services/notificationModalService/notificationModalSlice';
import UpdateModal from './Modals/UpdateModal';
import ConfirmModal from './Modals/ConfirmModal';
import { ConditionalComponent } from '.';

export const NotificationModal = () => {
    const dispatch = useAppDispatch();
    const open = useAppSelector((state) => state.notificationModal.open);
    const { header, subText, handleClose, handleConfirm } = useAppSelector((state) => state.notificationModal.data);
    const type = useAppSelector((state) => state.notificationModal.type);

    function _handleClose() {
        if (handleClose) handleClose();
        dispatch(closeNotificationModal());
    }

    function _handleConfirm() {
        if (handleConfirm) handleConfirm();
        dispatch(closeNotificationModal());
    }

    return (
        <Modal
            sx={{ border: '2px solid red' }}
            open={open}
            onClose={_handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <>
                <ConditionalComponent condition={type === 'update'}>
                    <UpdateModal header={header} subText={subText} handleClose={_handleClose} />
                </ConditionalComponent>
                <ConditionalComponent condition={type === 'confirm'}>
                    <ConfirmModal
                        header={header}
                        subText={subText}
                        handleConfirm={_handleConfirm}
                        handleClose={_handleClose}
                    />
                </ConditionalComponent>
            </>
        </Modal>
    );
};
