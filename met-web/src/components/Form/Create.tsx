import React from 'react';
import { selectError, FormEdit } from '@formio/react';
import './formio.scss';
import { useAppSelector } from 'hooks';

interface FormBuilderProps {
    handleSaveForm: (form: unknown) => void;
    savedForm?: unknown[];
}
const Create = ({ handleSaveForm, savedForm = [] }: FormBuilderProps) => {
    const errors = useAppSelector((state) => selectError('form', state));

    return (
        <FormEdit
            form={{ display: 'form', components: savedForm }}
            saveText={'Create Form'}
            errors={errors}
            saveForm={handleSaveForm}
        />
    );
};

export default Create;
