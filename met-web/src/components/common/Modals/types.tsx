export interface ModalProps {
    header: string;
    subText: string[];
    buttons?: ButtonProps[];
    handleClose: () => void;
}

export interface ButtonProps {
    buttonText: string;
    buttonFunction: unknown;
}
