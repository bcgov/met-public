export interface FormSubmitterProps {
    handleFormChange: (form: FormSubmissionData) => void;
    handleFormSubmit: (data: unknown) => void;
    savedForm?: FormBuilderData;
}

export interface FormBuilderProps {
    handleFormChange: (form: FormBuilderData) => void;
    savedForm?: FormBuilderData;
}

export interface FormBuilderData {
    display: string;
    components: Array<unknown>;
}
export interface FormSubmissionData {
    data: unknown;
    isValid: boolean;
}
