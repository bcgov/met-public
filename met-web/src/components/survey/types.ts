export type SurveyParams = {
    surveyId: string;
};

export interface FormBuilderForm {
    display: string;
    components: unknown[];
}

export interface EmailModalProps {
    open: boolean;
    handleClose: () => void;
}

export interface SuccessModalProps {
    open: boolean;
    handleClose: () => void;
    email: string;
}

export interface FailureModalProps {
    open: boolean;
    tryAgain: () => void;
    handleClose: () => void;
    email: string;
}
