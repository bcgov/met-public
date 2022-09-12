export interface ModalProps {
    header: string;
    subTextArray: string[];
    handleClose: () => void;
}

export interface ModalState {
    open: boolean;
    data: { header: string; subText: string[]; buttons?: ButtonProps[] };
    type: string;
}

export interface ButtonProps {
    buttonText: string;
    buttonFunction: unknown;
}
