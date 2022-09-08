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
        <Modal open={open} onClose={handleClose}>
            {type === 'closeModal' ? (
                <CloseModal header={modalData.header} subTextArray={modalData.subText} handleClose={handleClose} />
            ) : (
                <ConfirmModal header={modalData.header} subTextArray={modalData.subText} handleClose={handleClose} />
            )}
        </Modal>
    );
};
