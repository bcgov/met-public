/* eslint-disable */
import React, { useRef, useEffect, useState } from 'react';
import { Form } from '@formio/react';
import { FormSubmissionData, FormSubmitterProps } from './types';
import ProgressBar from 'components/survey/submit/FormProgressBar';

const FormSubmit = ({ handleFormChange, savedForm, handleFormSubmit }: FormSubmitterProps) => {
    const [currentPage, setCurrentPage] = useState(1);

    return (
        <div className="formio">
            <ProgressBar
                currentPage={currentPage}
                totalPages={
                    savedForm != undefined ? (savedForm.display === 'wizard' ? savedForm.components.length : 1) : 1
                }
            />
            <Form
                form={savedForm || { display: 'form' }}
                onChange={(form: unknown) => handleFormChange(form as FormSubmissionData)}
                onNextPage={(pageData) => setCurrentPage(pageData.page + 1)}
                onPrevPage={(pageData) => setCurrentPage(pageData.page + 1)}
                onSubmit={(form: unknown) => {
                    const formSubmissionData = form as FormSubmissionData;
                    handleFormSubmit(formSubmissionData.data);
                }}
            />
        </div>
    );
};

export default FormSubmit;
