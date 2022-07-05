import React from 'react';
import { selectError, FormBuilder as FormioFormBuilder } from '@formio/react';
import './formio.scss';
import { useAppSelector } from 'hooks';
import { formioOptions } from './FormBuilderOptions';

interface FormBuilderProps {
    handleFormChange: (form: unknown) => void;
    savedForm?: unknown;
}
const FormBuilder = ({ handleFormChange, savedForm = [] }: FormBuilderProps) => {
    const errors = useAppSelector((state) => selectError('form', state));

    return (
        <FormioFormBuilder
            form={{
                display: 'form',
                components: savedForm,
                title: 'blaa',
            }}
            options={formioOptions}
            saveText={'Create Form'}
            errors={errors}
            onChange={handleFormChange}
        />
    );
};

export default FormBuilder;
