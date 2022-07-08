import React from 'react';
import { FormBuilder as FormioFormBuilder } from '@formio/react';
import './formio.scss';
import { formioOptions } from './FormBuilderOptions';
import { FormProps } from './types';

const FormBuilder = ({ handleFormChange, savedForm }: FormProps) => {
    return (
        <FormioFormBuilder
            form={savedForm}
            options={formioOptions}
            saveText={'Create Form'}
            onChange={handleFormChange}
        />
    );
};

export default FormBuilder;
