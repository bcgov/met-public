import { ModalSubtext } from 'components/common/Modals/types';

export interface ModalProps {
    header: string;
    subTextArray: ModalSubtext[];
    handleClose: () => void;
}

export interface NotificationModalState {
    open: boolean;
    data: {
        header: string;
        subText: ModalSubtext[];
        confirmButtonText?: string;
        cancelButtonText?: string;
        handleConfirm?: () => void;
        handleClose?: () => void;
    };
    type: string;
}
