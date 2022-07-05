import React from 'react';
import { selectError, FormBuilder } from '@formio/react';
import './formio.scss';
import { useAppSelector } from 'hooks';
import { formioOptions } from './FormBuilderOptions';

interface FormBuilderProps {
    handleSaveForm: (form: unknown) => void;
    savedForm?: unknown[];
}
const Create = ({ handleSaveForm, savedForm = [] }: FormBuilderProps) => {
    const errors = useAppSelector((state) => selectError('form', state));

    return (
        <FormBuilder
            form={{
                display: 'form',
                components: savedForm,
                title: 'blaa',
            }}
            options={formioOptions}
            saveText={'Create Form'}
            errors={errors}
            saveForm={handleSaveForm}
            onChange={(change: unknown) => console.log(change)}
        />
    );
};

export default Create;
