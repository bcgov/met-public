export type SurveyParams = {
    surveyId?: string;
    slug?: string;
    token: string;
};

export interface FormBuilderForm {
    display: string;
    components: unknown[];
}

export interface InvalidTokenModalProps {
    open: boolean;
    handleClose: () => void;
}

export interface SurveyFormProps {
    handleClose: () => void;
}
