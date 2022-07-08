/* eslint-disable */
import React from 'react';
import { Form } from '@formio/react';
import { FormProps } from './types';

const FormSubmit = ({ handleFormChange, savedForm }: FormProps) => {
    return (
        <Form
            form={savedForm}
            onChange={handleFormChange}
            onSubmit={(formSubmit: unknown) => console.log(formSubmit)}
        />
    );
};

export default FormSubmit;
