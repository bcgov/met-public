/* eslint-disable */
import React, { useState } from 'react';
import { Form } from '@formio/react';
import { FormSubmissionData, FormSubmitterProps } from './types';
import ProgressBar from 'components/survey/submit/FormProgressBar';

interface PageData {
    page: number;
    submission: unknown;
}

const FormSubmit = ({ handleFormChange, savedForm, handleFormSubmit }: FormSubmitterProps) => {
    console.log(savedForm);
    const [currentPage, setCurrentPage] = useState(0);
    return (
        <div className="formio">
            {savedForm && savedForm.display === 'wizard' ? (
                <ProgressBar
                    currentPage={currentPage}
                    totalPages={
                        savedForm != undefined ? (savedForm.display === 'wizard' ? savedForm.components.length - 1 : 0) : 0
                    }
                />
            ) : (
                <></>
            )}
            <Form
                form={savedForm || { display: 'form' }}
                onChange={(form: unknown) => handleFormChange(form as FormSubmissionData)}
                onNextPage={(pageData: PageData) => setCurrentPage(pageData.page)}
                onPrevPage={(pageData: PageData) => setCurrentPage(pageData.page)}
                onSubmit={(form: unknown) => {
                    const formSubmissionData = form as FormSubmissionData;
                    handleFormSubmit(formSubmissionData.data);
                }}
            />
        </div>
    );
};

export default FormSubmit;
