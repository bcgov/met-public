export interface ModalSubtext {
    text: string;
    bold?: boolean;
}

export interface NotificationModalProps {
    header: string;
    subText: ModalSubtext[];
    handleConfirm?: () => void;
    handleClose?: () => void;
}

export interface ModalProps {
    open: boolean;
    isSaving: boolean;
    header: string;
    subText: Array<ModalSubtext>;
    email: string;
    termsOfService: Array<string>;
    handleConfirm: () => void;
    updateEmail: (email: string) => void;
    updateModal: (open: boolean) => void;
}
