export interface FormSubmitterProps {
    handleFormChange: (form: FormSubmissionData) => void;
    handleFormSubmit: (data: unknown) => void;
    savedForm?: FormBuilderData;
}

export interface FormBuilderProps {
    handleFormChange: (form: FormBuilderData) => void;
    savedForm?: FormBuilderData;
}

export interface FormInfo {
    title: string;
    [key: string]: unknown;
}

export interface FormBuilderData {
    display: string;
    components: Array<FormInfo>;
}
export interface FormSubmissionData {
    data: unknown;
    isValid: boolean;
}
