import { ReactNode } from 'react';

export interface ModalSubtext {
    text: string;
    bold?: boolean;
}

export interface NotificationModalProps {
    style?: 'default' | 'danger' | 'warning' | 'success';
    header: string;
    subHeader?: string;
    subText: ModalSubtext[];
    subTextId?: string;
    handleConfirm?: () => void;
    handleClose?: () => void;
    cancelButtonText?: string;
    confirmButtonText?: string;
}

export interface ModalProps {
    open: boolean;
    isSaving: boolean;
    header: string;
    subText: Array<ModalSubtext>;
    email: string;
    signupoptions: ReactNode | null;
    termsOfService: ReactNode;
    handleConfirm: () => void;
    updateEmail: (email: string) => void;
    updateModal: (open: boolean) => void;
}
