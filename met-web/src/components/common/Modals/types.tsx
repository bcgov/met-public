export interface NotificationModalProps {
    header: string;
    subText: string[];
    handleConfirm?: () => void;
    handleClose?: () => void;
}

export interface ModalProps {
    open: boolean;
    isSaving: boolean;
    header: string;
    subText: Array<string>;
    email: string;
    termsOfService: Array<string>;
    handleConfirm: () => void;
    updateEmail: (email: string) => void;
    updateModal: (open: boolean) => void;
}
