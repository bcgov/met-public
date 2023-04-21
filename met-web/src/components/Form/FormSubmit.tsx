import React from 'react';
import { FormSubmitterProps } from './types';
import SinglePageForm from './SinglePageForm';
import MultiPageForm from './MultiPageForm';

const FormSubmit = ({ handleFormChange, savedForm, handleFormSubmit }: FormSubmitterProps) => {
    const isMultiPage = savedForm && savedForm.display === 'wizard';

    return isMultiPage ? (
        <MultiPageForm handleFormChange={handleFormChange} savedForm={savedForm} handleFormSubmit={handleFormSubmit} />
    ) : (
        <SinglePageForm handleFormChange={handleFormChange} savedForm={savedForm} handleFormSubmit={handleFormSubmit} />
    );
};

export default FormSubmit;
