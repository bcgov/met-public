export interface ModalProps {
    header: string;
    subTextArray: string[];
    handleClose: () => void;
}

export interface NotificationModalState {
    open: boolean;
    data: {
        header: string;
        subText: string[];
        handleConfirm?: () => void;
        handleClose?: () => void;
    };
    type: string;
}
