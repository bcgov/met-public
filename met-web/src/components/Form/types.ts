export interface FormProps {
    handleFormChange: (form: unknown) => void;
    savedForm: unknown;
    onSubmit?: (form: unknown) => void;
}
