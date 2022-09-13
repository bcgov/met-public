export interface NotificationModalProps {
    header: string;
    subText: string[];
    handleConfirm?: () => void;
    handleClose: () => void;
}
