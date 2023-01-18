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
        handleConfirm?: () => void;
        handleClose?: () => void;
    };
    type: string;
}
