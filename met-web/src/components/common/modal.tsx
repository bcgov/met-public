import * as React from 'react';
import { useAppSelector, useAppDispatch } from '../../hooks';
import Modal from '@mui/material/Modal';
import { closeModal } from 'services/modalService/modalSlice';
import UpdateModal from './Modals/UpdateModal';
import ConfirmModal from './Modals/ConfirmModal';
import { ConditionalComponent } from '.';

export const NotificationModal = () => {
    const dispatch = useAppDispatch();
    const open = useAppSelector((state) => state.notificationModal.open);
    const modalData = useAppSelector((state) => state.notificationModal.data);
    const type = useAppSelector((state) => state.notificationModal.type);

    function handleClose() {
        dispatch(closeModal());
    }

    return (
        <Modal
            sx={{ border: '2px solid red' }}
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <>
                <ConditionalComponent condition={type === 'update'}>
                    <UpdateModal
                        header={modalData.header}
                        subText={modalData.subText}
                        handleClose={modalData.handleClose ? modalData.handleClose : handleClose}
                    />
                </ConditionalComponent>
                <ConditionalComponent condition={type === 'confirm'}>
                    <ConfirmModal
                        header={modalData.header}
                        subText={modalData.subText}
                        handleConfirm={modalData.handleConfirm}
                        handleClose={modalData.handleClose ? modalData.handleClose : handleClose}
                    />
                </ConditionalComponent>
            </>
        </Modal>
    );
};
