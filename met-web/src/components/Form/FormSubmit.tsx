/* eslint-disable */
import React from 'react';
import { Form } from '@formio/react';
import { FormSubmissionData, FormSubmitterProps } from './types';

const FormSubmit = ({ handleFormChange, savedForm }: FormSubmitterProps) => {
    return (
        <div className="formio">
            <Form
                form={savedForm || { display: 'form' }}
                onChange={(form: unknown) => handleFormChange(form as FormSubmissionData)}
            />
        </div>
    );
};

export default FormSubmit;
