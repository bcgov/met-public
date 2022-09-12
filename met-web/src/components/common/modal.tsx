import * as React from 'react';
import { useAppSelector, useAppDispatch } from '../../hooks';
import Modal from '@mui/material/Modal';
import { closeModal } from 'services/modalService/modalSlice';
import CloseModal from './Modals/UpdateModal';
import ConfirmModal from './Modals/ConfirmModal';

export const ModalProvider = () => {
    const dispatch = useAppDispatch();
    const open = useAppSelector((state) => state.modal.open);
    const modalData = useAppSelector((state) => state.modal.data);
    const type = useAppSelector((state) => state.modal.type);

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
            {type === 'closeModal' ? (
                <CloseModal header={modalData.header} subText={modalData.subText} handleClose={handleClose} />
            ) : (
                <ConfirmModal header={modalData.header} subText={modalData.subText} handleClose={handleClose} />
            )}
        </Modal>
    );
};
