export interface FormSubmitterProps {
    handleFormChange: (form: FormSubmissionData) => void;
    savedForm?: FormBuilderData;
}

export interface FormBuilderProps {
    handleFormChange: (form: FormBuilderData) => void;
    savedForm?: FormBuilderData;
}

export interface FormBuilderData {
    display: string;
    components: unknown;
}
export interface FormSubmissionData {
    data: unknown;
}
