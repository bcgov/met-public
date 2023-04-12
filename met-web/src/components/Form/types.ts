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
    [key: string]: any;
}

export interface FormBuilderData {
    display: string;
    components: Array<FormInfo>;
}
export interface FormSubmissionData {
    data: unknown;
    isValid: boolean;
}
