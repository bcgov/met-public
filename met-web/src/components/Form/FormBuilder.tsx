import React from 'react';
import { FormBuilder as FormioFormBuilder } from '@formio/react';
import './formio.scss';
import { formioOptions } from './FormBuilderOptions';
import { FormBuilderData, FormBuilderProps } from './types';

const FormBuilder = ({ handleFormChange, savedForm }: FormBuilderProps) => {
    return (
        <FormioFormBuilder
            form={savedForm || { display: 'form' }}
            options={formioOptions}
            saveText={'Create Form'}
            onChange={(form: unknown) => handleFormChange(form as FormBuilderData)}
        />
    );
};

export default FormBuilder;
