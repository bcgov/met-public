/* eslint-disable */
import React from 'react';
import { Form } from '@formio/react';
import { FormSubmissionData, FormSubmitterProps } from './types';

const FormSubmit = ({ handleFormChange, savedForm }: FormSubmitterProps) => {
    return (
        <Form
            form={savedForm || { display: 'form' }}
            onChange={(form: unknown) => handleFormChange(form as FormSubmissionData)}
        />
    );
};

export default FormSubmit;
