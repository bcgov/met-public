import React from 'react';
import { FormBuilder as FormioFormBuilder } from '@formio/react';
import { formioOptions } from './FormBuilderOptions';
import { FormBuilderData, FormBuilderProps } from './types';
import setupFormio from './formio/setup';

setupFormio();

const FormBuilder = ({ handleFormChange, savedForm }: FormBuilderProps) => {
    return (
        <div className="formio">
            <FormioFormBuilder
                form={savedForm || { display: 'form' }}
                options={formioOptions}
                saveText={'Create Form'}
                onChange={(form: unknown) => handleFormChange(form as FormBuilderData)}
            />
        </div>
    );
};

export default FormBuilder;
